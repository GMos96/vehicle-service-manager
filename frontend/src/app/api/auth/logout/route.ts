import { NextResponse } from "next/server";
import { AUTH_STATUS_COOKIE, TOKEN_COOKIE } from "@/core/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(AUTH_STATUS_COOKIE);
  return response;
}
