import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { User } from "./auth";

export function withAuth<T extends unknown[], R>(
  handler: (user: User, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const user = await getSession();

    if (!user) {
      redirect("/login");
    }

    return handler(user, ...args);
  };
}
