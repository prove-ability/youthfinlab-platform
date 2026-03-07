import { db, guests, classes } from "@repo/db";
import { eq, and } from "drizzle-orm";

export interface User {
  id: string;
  name: string;
  loginId: string;
  classId: string;
}

export type VerifyResult =
  | { success: true; user: User }
  | {
      success: false;
      reason: "invalid_credentials" | "class_not_active" | "invalid_class_code";
    };

export async function verifyCredentials(
  loginId: string,
  password: string,
  classCode: string
): Promise<VerifyResult> {
  try {
    const classData = await db.query.classes.findFirst({
      where: and(
        eq(classes.code, classCode.toUpperCase()),
        eq(classes.programType, "finance_sim")
      ),
    });

    if (!classData) {
      return { success: false, reason: "invalid_class_code" };
    }

    if (classData.status !== "active") {
      return { success: false, reason: "class_not_active" };
    }

    const user = await db.query.guests.findFirst({
      where: and(
        eq(guests.classId, classData.id),
        eq(guests.loginId, loginId),
        eq(guests.password, password)
      ),
    });

    if (!user) {
      return { success: false, reason: "invalid_credentials" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        loginId: user.loginId,
        classId: user.classId,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, reason: "invalid_credentials" };
  }
}
