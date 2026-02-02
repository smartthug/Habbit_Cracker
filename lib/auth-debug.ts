import { cookies } from "next/headers";
import { verifyAccessToken, TokenPayload } from "./jwt";

/**
 * Development-only auth debugging utility
 * Disabled in production for security
 */
export async function debugAuth(route: string): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    return; // Disabled in production
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const debugInfo = {
      route,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      userId: null as string | null,
      email: null as string | null,
      timestamp: new Date().toISOString(),
    };

    if (token) {
      try {
        const payload = verifyAccessToken(token);
        debugInfo.userId = payload.userId;
        debugInfo.email = payload.email;
      } catch (error) {
        debugInfo.userId = "INVALID_TOKEN";
      }
    }

    console.log("[AUTH DEBUG]", JSON.stringify(debugInfo, null, 2));
  } catch (error) {
    // Silently fail in debug mode
  }
}
