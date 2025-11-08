// frontend/src/lib/auth.ts
import { verify } from "jsonwebtoken";

export async function getUserFromToken(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;

  try {
    return verify(token, process.env.JWT_SECRET || "") as { userId: number };
  } catch {
    return null;
  }
}
