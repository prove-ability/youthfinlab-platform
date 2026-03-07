import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { User } from "./auth";

const SESSION_COOKIE_NAME = "finance_sim_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET env var is missing or too short (min 32 chars)");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encode(user: User): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(value: string): User | null {
  const dotIndex = value.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const payload = value.slice(0, dotIndex);
  const receivedSig = value.slice(dotIndex + 1);
  const expectedSig = sign(payload);

  try {
    if (!timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as User;
  } catch {
    return null;
  }
}

export async function createSession(user: User) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, encode(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  return decode(sessionCookie.value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
