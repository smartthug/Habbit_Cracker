"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Cookie configuration - single source of truth
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function setAuthCookies(accessToken: string, refreshToken: string) {
  try {
    const cookieStore = cookies();
    cookieStore.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 15, // 15 minutes
    });
    cookieStore.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    console.log("[AUTH] Cookies set successfully");
  } catch (error) {
    console.error("[AUTH] Error setting cookies:", error);
    throw error;
  }
}

export async function signup(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = signupSchema.parse(rawData);
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    console.log("[AUTH] Generating tokens for user:", user.email);
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    console.log("[AUTH] Tokens generated, accessToken length:", accessToken.length);

    // Set cookies
    setAuthCookies(accessToken, refreshToken);

    // Return success - client will handle redirect
    return { success: true, user: { id: user._id.toString(), name: user.name, email: user.email } };
  } catch (error: any) {
    console.error("[AUTH] Signup error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error.message || "Signup failed" };
  }
}

export async function login(formData: FormData) {
  try {
    console.log("[AUTH] Login attempt started");
    
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    console.log("[AUTH] Email:", rawData.email);

    const validatedData = loginSchema.parse(rawData);
    await connectDB();

    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      console.log("[AUTH] User not found");
      return { error: "Invalid email or password" };
    }

    console.log("[AUTH] User found:", user.email);

    // Verify password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
    if (!isValidPassword) {
      console.log("[AUTH] Invalid password");
      return { error: "Invalid email or password" };
    }

    console.log("[AUTH] Password verified");

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    console.log("[AUTH] Generating tokens...");
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    console.log("[AUTH] Tokens generated - accessToken length:", accessToken.length);
    console.log("[AUTH] Token preview:", accessToken.substring(0, 20) + "...");

    // Set cookies
    console.log("[AUTH] Setting cookies...");
    setAuthCookies(accessToken, refreshToken);
    console.log("[AUTH] Cookies set, returning success");

    // Return success - client will handle redirect
    return { success: true, user: { id: user._id.toString(), name: user.name, email: user.email } };
  } catch (error: any) {
    console.error("[AUTH] Login error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: error.message || "Login failed" };
  }
}

export async function logout() {
  try {
    const cookieStore = cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Logout failed" };
  }
}
