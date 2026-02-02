"use server";

import { z } from "zod";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Topic from "@/models/Topic";
import mongoose from "mongoose";

const createTopicSchema = z.object({
  name: z.string().min(1, "Topic name is required"),
});

export async function createTopic(formData: FormData) {
  try {
    const user = await requireAuth();
    await connectDB();

    const rawData = {
      name: formData.get("name") as string,
    };

    const validatedData = createTopicSchema.parse(rawData);

    const topic = await Topic.create({
      userId: new mongoose.Types.ObjectId(user.userId),
      name: validatedData.name,
    });

    return { success: true, topic: JSON.parse(JSON.stringify(topic)) };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error.message || "Failed to create topic" };
  }
}

export async function getTopics() {
  try {
    const user = await requireAuth();
    await connectDB();

    const topics = await Topic.find({
      userId: user.userId,
      archived: false,
    }).sort({ createdAt: -1 });

    return { success: true, topics: JSON.parse(JSON.stringify(topics)) };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch topics" };
  }
}

export async function deleteTopic(topicId: string) {
  try {
    const user = await requireAuth();
    await connectDB();

    const topic = await Topic.findOneAndUpdate(
      {
        _id: topicId,
        userId: user.userId,
      },
      { archived: true },
      { new: true }
    );

    if (!topic) {
      return { error: "Topic not found" };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete topic" };
  }
}
