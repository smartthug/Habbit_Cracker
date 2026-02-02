"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import DailyLog from "@/models/DailyLog";
import mongoose from "mongoose";

const createDailyLogSchema = z.object({
  date: z.string().optional(),
  notes: z.string(),
  mood: z.enum(["happy", "neutral", "sad", "anxious", "excited"]).optional(),
});

export async function createOrUpdateDailyLog(formData: FormData) {
  try {
    const user = await requireAuth();
    await connectDB();

    const rawData = {
      date: (formData.get("date") as string) || undefined,
      notes: (formData.get("notes") as string) || "",
      mood: (formData.get("mood") as string) || undefined,
    };

    const validatedData = createDailyLogSchema.parse(rawData);

    const logDate = validatedData.date ? new Date(validatedData.date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const log = await DailyLog.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(user.userId),
        date: logDate,
      },
      {
        userId: new mongoose.Types.ObjectId(user.userId),
        date: logDate,
        notes: validatedData.notes,
        mood: validatedData.mood || undefined,
      },
      { upsert: true, new: true }
    );

    return { success: true, log: JSON.parse(JSON.stringify(log)) };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { error: `${firstError.path.join(".")}: ${firstError.message}` };
    }
    return { error: error.message || "Failed to save daily log" };
  }
}

export async function getDailyLog(date?: string) {
  try {
    const user = await requireAuth();
    await connectDB();

    const logDate = date ? new Date(date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const log = await DailyLog.findOne({
      userId: user.userId,
      date: logDate,
    });

    return { success: true, log: log ? JSON.parse(JSON.stringify(log)) : null };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch daily log" };
  }
}
