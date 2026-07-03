// frontend/src/lib/auth.ts
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "@/core/env";

export const TOKEN_COOKIE = "vsm-token";
export const AUTH_STATUS_COOKIE = "vsm-authenticated";

export async function getUserFromToken(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${TOKEN_COOKIE}=`))
    ?.slice(TOKEN_COOKIE.length + 1);

  if (!token) return null;

  try {
    return verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}
