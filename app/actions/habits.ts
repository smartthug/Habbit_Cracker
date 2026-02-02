"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import Idea from "@/models/Idea";
import mongoose from "mongoose";

const createHabitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  category: z.enum(["health", "learning", "business", "personal", "custom"]),
  frequency: z.enum(["daily", "weekly", "custom"]),
  priority: z.enum(["low", "medium", "high"]),
  reminderTime: z.string().optional(),
  ideaGenerating: z.boolean().optional(),
});

export async function createHabit(formData: FormData) {
  try {
    const user = await requireAuth();
    await connectDB();

    const rawData = {
      name: (formData.get("name") as string) || "",
      category: (formData.get("category") as string) || "",
      frequency: (formData.get("frequency") as string) || "",
      priority: (formData.get("priority") as string) || "",
      reminderTime: (formData.get("reminderTime") as string) || undefined,
      ideaGenerating: formData.get("ideaGenerating") === "true",
    };

    const validatedData = createHabitSchema.parse(rawData);

    const habit = await Habit.create({
      userId: new mongoose.Types.ObjectId(user.userId),
      ...validatedData,
    });

    return { success: true, habit: JSON.parse(JSON.stringify(habit)) };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { error: `${firstError.path.join(".")}: ${firstError.message}` };
    }
    return { error: error.message || "Failed to create habit" };
  }
}

export async function getHabits() {
  try {
    const user = await requireAuth();
    await connectDB();

    const habits = await Habit.find({ userId: user.userId }).sort({ createdAt: -1 });

    return { success: true, habits: JSON.parse(JSON.stringify(habits)) };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch habits" };
  }
}

export async function deleteHabit(habitId: string) {
  try {
    const user = await requireAuth();
    await connectDB();

    const habit = await Habit.findOneAndDelete({
      _id: habitId,
      userId: user.userId,
    });

    if (!habit) {
      return { error: "Habit not found" };
    }

    // Delete related logs and ideas
    await HabitLog.deleteMany({ habitId: habit._id, userId: user.userId });
    await Idea.updateMany(
      { habitId: habit._id, userId: user.userId },
      { $unset: { habitId: 1 } }
    );

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete habit" };
  }
}

export async function logHabit(habitId: string, status: "done" | "skipped", date?: string) {
  try {
    const user = await requireAuth();
    await connectDB();

    const logDate = date ? new Date(date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    // Check if habit belongs to user
    const habit = await Habit.findOne({
      _id: habitId,
      userId: user.userId,
    });

    if (!habit) {
      return { error: "Habit not found" };
    }

    // Upsert log
    const log = await HabitLog.findOneAndUpdate(
      {
        habitId: new mongoose.Types.ObjectId(habitId),
        userId: new mongoose.Types.ObjectId(user.userId),
        date: logDate,
      },
      {
        habitId: new mongoose.Types.ObjectId(habitId),
        userId: new mongoose.Types.ObjectId(user.userId),
        date: logDate,
        status,
      },
      { upsert: true, new: true }
    );

    return { success: true, log: JSON.parse(JSON.stringify(log)) };
  } catch (error: any) {
    return { error: error.message || "Failed to log habit" };
  }
}

export async function getHabitLogs(habitId?: string) {
  try {
    const user = await requireAuth();
    await connectDB();

    const query: any = { userId: user.userId };
    if (habitId) {
      query.habitId = habitId;
    }

    const logs = await HabitLog.find(query).sort({ date: -1 });

    return { success: true, logs: JSON.parse(JSON.stringify(logs)) };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch logs" };
  }
}

export async function getTodayHabits() {
  try {
    const user = await requireAuth();
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habits = await Habit.find({ userId: user.userId }).lean();
    const logs = await HabitLog.find({
      userId: user.userId,
      date: today,
    }).lean();

    const logMap = new Map(logs.map((log: any) => [log.habitId.toString(), log.status]));

    const habitsWithStatus = habits.map((habit: any) => ({
      ...habit,
      todayStatus: logMap.get(habit._id.toString()) || null,
    }));

    return { success: true, habits: JSON.parse(JSON.stringify(habitsWithStatus)) };
  } catch (error: any) {
    console.error("Error in getTodayHabits:", error);
    return { success: false, habits: [], error: error.message || "Failed to fetch today's habits" };
  }
}

export async function getHabitStreak(habitId: string) {
  try {
    const user = await requireAuth();
    await connectDB();

    const logs = await HabitLog.find({
      habitId,
      userId: user.userId,
      status: "done",
    })
      .sort({ date: -1 })
      .limit(365);

    if (logs.length === 0) return { success: true, streak: 0 };

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today is done
    const todayLog = logs.find(
      (log) => log.date.toDateString() === today.toDateString()
    );

    if (!todayLog) {
      // Check yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayLog = logs.find(
        (log) => log.date.toDateString() === yesterday.toDateString()
      );
      if (!yesterdayLog) return { success: true, streak: 0 };
    }

    // Count consecutive days
    let currentDate = new Date(today);
    for (const log of logs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (logDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return { success: true, streak };
  } catch (error: any) {
    return { error: error.message || "Failed to calculate streak" };
  }
}
