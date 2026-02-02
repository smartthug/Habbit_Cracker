import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Debug route to test if cookies are being set correctly
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  return NextResponse.json({
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    accessTokenLength: accessToken?.value?.length || 0,
    refreshTokenLength: refreshToken?.value?.length || 0,
  });
}
