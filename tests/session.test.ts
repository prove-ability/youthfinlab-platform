import { it, expect, vi, afterEach } from "vitest";
import * as stock from "../apps/stock-sim/lib/session";
import * as finance from "../apps/finance-sim/lib/session";
const jar = vi.hoisted(() => new Map<string, string>());
vi.mock("next/headers", () => ({
  cookies: async () => ({
    set: (key: string, value: string) => jar.set(key, value),
    get: (key: string) => (jar.has(key) ? { value: jar.get(key) } : undefined),
    delete: (key: string) => jar.delete(key),
  }),
}));
afterEach(() => {
  jar.clear();
  vi.unstubAllEnvs();
});
it.each([
  ["stock", stock],
  ["finance", finance],
] as const)("round trips and deletes the %s session", async (_, session) => {
  vi.stubEnv("SESSION_SECRET", "a".repeat(32));
  const user = {
    id: "student",
    name: "학생",
    classId: "class",
    loginId: "student",
  };
  expect(await session.getSession()).toBeNull();
  await session.createSession(user);
  expect(await session.getSession()).toEqual(user);
  await session.deleteSession();
  expect(await session.getSession()).toBeNull();
});
