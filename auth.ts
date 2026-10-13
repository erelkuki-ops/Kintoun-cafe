import crypto from "crypto";
import { cookies, headers } from "next/headers";

const SECRET = process.env.ADMIN_SESSION_SECRET || "kintoun-dev-secret-ganti-di-production-2024";
export const COOKIE_NAME = "kintoun_admin";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const calc = crypto.scryptSync(password, salt, 64).toString("hex");
    const a = Buffer.from(hash, "hex");
    const b = Buffer.from(calc, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function sign(data: string) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

export function createSessionToken(username: string) {
  const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string | null): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  } catch {
    if (sig !== expected) return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() > data.exp) return null;
    return data.u as string;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true as const,
    path: "/",
    maxAge,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function getAdminUser() {
  const store = await cookies();
  const fromCookie = verifySessionToken(store.get(COOKIE_NAME)?.value);
  if (fromCookie) return fromCookie;
  const h = await headers();
  const auth = h.get("authorization") || h.get("Authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return verifySessionToken(auth.slice(7).trim());
  }
  return null;
}

export async function requireAdmin() {
  return getAdminUser();
}
