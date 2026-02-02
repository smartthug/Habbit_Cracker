import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Debug endpoint to check login state
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");

    return NextResponse.json({
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenValue: accessToken?.value ? `${accessToken.value.substring(0, 20)}...` : null,
      refreshTokenValue: refreshToken?.value ? `${refreshToken.value.substring(0, 20)}...` : null,
      allCookies: Object.fromEntries(
        cookieStore.getAll().map((cookie) => [cookie.name, cookie.value.substring(0, 20) + "..."])
      ),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      hasAccessToken: false,
      hasRefreshToken: false,
    });
  }
}
