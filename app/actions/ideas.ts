"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Idea from "@/models/Idea";
import Topic from "@/models/Topic";
import mongoose from "mongoose";

const createIdeaSchema = z.object({
  text: z.string().min(1, "Idea text is required"),
  topicId: z.string().optional(),
  habitId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(["normal", "important"]).optional(),
});

export async function createIdea(formData: FormData) {
  try {
    const user = await requireAuth();
    await connectDB();

    const rawData = {
      text: (formData.get("text") as string) || "",
      topicId: (formData.get("topicId") as string) || undefined,
      habitId: (formData.get("habitId") as string) || undefined,
      tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((t) => t.trim()).filter((t) => t) : [],
      priority: (formData.get("priority") as string) || "normal",
    };

    const validatedData = createIdeaSchema.parse(rawData);

    // Verify topic belongs to user if provided
    if (validatedData.topicId) {
      const topic = await Topic.findOne({
        _id: validatedData.topicId,
        userId: user.userId,
      });
      if (!topic) {
        return { error: "Topic not found" };
      }
    }

    const idea = await Idea.create({
      userId: new mongoose.Types.ObjectId(user.userId),
      text: validatedData.text,
      topicId: validatedData.topicId ? new mongoose.Types.ObjectId(validatedData.topicId) : undefined,
      habitId: validatedData.habitId ? new mongoose.Types.ObjectId(validatedData.habitId) : undefined,
      tags: validatedData.tags || [],
      priority: validatedData.priority || "normal",
    });

    return { success: true, idea: JSON.parse(JSON.stringify(idea)) };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { error: `${firstError.path.join(".")}: ${firstError.message}` };
    }
    return { error: error.message || "Failed to create idea" };
  }
}

export async function getIdeas(filters?: {
  topicId?: string;
  habitId?: string;
  tags?: string[];
  priority?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  try {
    const user = await requireAuth();
    await connectDB();

    const query: any = { userId: user.userId };

    if (filters?.topicId) {
      query.topicId = new mongoose.Types.ObjectId(filters.topicId);
    }

    if (filters?.habitId) {
      query.habitId = new mongoose.Types.ObjectId(filters.habitId);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters?.priority) {
      query.priority = filters.priority;
    }

    if (filters?.search) {
      query.text = { $regex: filters.search, $options: "i" };
    }

    if (filters?.dateFrom || filters?.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) {
        query.createdAt.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query.createdAt.$lte = new Date(filters.dateTo);
      }
    }

    const ideas = await Idea.find(query).sort({ createdAt: -1 }).lean();

    return { success: true, ideas: JSON.parse(JSON.stringify(ideas)) };
  } catch (error: any) {
    console.error("Error in getIdeas:", error);
    return { success: false, ideas: [], error: error.message || "Failed to fetch ideas" };
  }
}

export async function deleteIdea(ideaId: string) {
  try {
    const user = await requireAuth();
    await connectDB();

    const idea = await Idea.findOneAndDelete({
      _id: ideaId,
      userId: user.userId,
    });

    if (!idea) {
      return { error: "Idea not found" };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete idea" };
  }
}

export async function updateIdea(ideaId: string, formData: FormData) {
  try {
    const user = await requireAuth();
    await connectDB();

    const updateData: any = {};

    if (formData.has("text")) {
      updateData.text = formData.get("text") as string;
    }
    if (formData.has("topicId")) {
      const topicId = formData.get("topicId") as string;
      if (topicId) {
        const topic = await Topic.findOne({
          _id: topicId,
          userId: user.userId,
        });
        if (!topic) {
          return { error: "Topic not found" };
        }
        updateData.topicId = new mongoose.Types.ObjectId(topicId);
      } else {
        updateData.topicId = null;
      }
    }
    if (formData.has("tags")) {
      updateData.tags = (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (formData.has("priority")) {
      updateData.priority = formData.get("priority") as string;
    }

    const idea = await Idea.findOneAndUpdate(
      { _id: ideaId, userId: user.userId },
      updateData,
      { new: true }
    );

    if (!idea) {
      return { error: "Idea not found" };
    }

    return { success: true, idea: JSON.parse(JSON.stringify(idea)) };
  } catch (error: any) {
    return { error: error.message || "Failed to update idea" };
  }
}
