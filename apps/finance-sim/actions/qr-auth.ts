"use server";

import { db, dbWithTransaction, classes, guests } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { createSession } from "@/lib/session";

export type QRVerifyResult =
  | { success: true; classId: string; className: string }
  | {
      success: false;
      reason:
        | "invalid_token"
        | "expired_token"
        | "class_not_active"
        | "invalid_class";
    };

export async function verifyQRToken(
  token: string,
  classId: string
): Promise<QRVerifyResult> {
  try {
    const classData = await db.query.classes.findFirst({
      where: and(
        eq(classes.id, classId),
        eq(classes.programType, "finance_sim")
      ),
    });

    if (!classData) {
      return { success: false, reason: "invalid_class" };
    }

    if (classData.qrToken !== token) {
      return { success: false, reason: "invalid_token" };
    }

    if (
      !classData.qrExpiresAt ||
      new Date() > new Date(classData.qrExpiresAt)
    ) {
      return { success: false, reason: "expired_token" };
    }

    if (classData.status !== "active") {
      return { success: false, reason: "class_not_active" };
    }

    if (classData.loginMethod !== "qr") {
      return { success: false, reason: "invalid_token" };
    }

    return {
      success: true,
      classId: classData.id,
      className: classData.name,
    };
  } catch (error) {
    console.error("QR token verification error:", error);
    return { success: false, reason: "invalid_token" };
  }
}

export async function createQRGuestSession(
  classId: string,
  nickname: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const classData = await db.query.classes.findFirst({
      where: and(
        eq(classes.id, classId),
        eq(classes.programType, "finance_sim")
      ),
    });

    if (!classData) {
      return { success: false, error: "클래스를 찾을 수 없습니다." };
    }

    const existingGuest = await db.query.guests.findFirst({
      where: and(eq(guests.classId, classId), eq(guests.nickname, nickname)),
    });

    if (existingGuest) {
      return { success: false, error: "이미 사용 중인 닉네임입니다." };
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const loginId = `qr_${timestamp}_${randomSuffix}`;
    const password = Math.random().toString(36).substring(2, 15);

    const result = await dbWithTransaction.transaction(async (tx) => {
      const [newGuest] = await tx
        .insert(guests)
        .values({
          name: nickname,
          nickname: nickname,
          loginId: loginId,
          password: password,
          classId: classId,
          mobilePhone: "",
          affiliation: "QR 로그인",
          grade: "",
        })
        .returning({
          id: guests.id,
          name: guests.name,
          loginId: guests.loginId,
          classId: guests.classId,
        });

      if (!newGuest) {
        throw new Error("계정 생성에 실패했습니다.");
      }

      return newGuest;
    });

    await createSession({
      id: result.id,
      name: result.name,
      loginId: result.loginId,
      classId: result.classId,
    });

    return { success: true };
  } catch (error) {
    console.error("QR guest session creation error:", error);
    return { success: false, error: "계정 생성 중 오류가 발생했습니다." };
  }
}
