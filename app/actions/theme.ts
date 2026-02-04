"use server";

import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import User from "@/models/User";
import mongoose from "mongoose";

export async function getUserTheme(): Promise<{ success: boolean; theme?: "light" | "dark"; error?: string }> {
  try {
    const user = await requireAuth();
    await connectDB();

    const dbUser = await User.findById(user.userId).select("theme");
    
    if (!dbUser) {
      return { success: false, error: "User not found" };
    }

    return { success: true, theme: (dbUser.theme as "light" | "dark") || "light" };
  } catch (error: any) {
    // If user is not authenticated, return default theme
    if (error.message === "Unauthorized") {
      return { success: true, theme: "light" };
    }
    console.error("[THEME] Error getting user theme:", error);
    return { success: false, error: error.message || "Failed to get theme" };
  }
}

export async function updateUserTheme(theme: "light" | "dark"): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();
    await connectDB();

    await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(user.userId),
      { theme },
      { new: true }
    );

    return { success: true };
  } catch (error: any) {
    console.error("[THEME] Error updating user theme:", error);
    return { success: false, error: error.message || "Failed to update theme" };
  }
}
