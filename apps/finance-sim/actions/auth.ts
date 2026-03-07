"use server";

import { verifyCredentials } from "@/lib/auth";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const classCode = formData.get("classCode") as string;
  const loginId = formData.get("loginId") as string;
  const password = formData.get("password") as string;

  if (!classCode || !loginId || !password) {
    return { error: "모든 항목을 입력해주세요." };
  }

  const result = await verifyCredentials(loginId, password, classCode);

  if (!result.success) {
    switch (result.reason) {
      case "invalid_class_code":
        return { error: "유효하지 않은 수업 코드입니다." };
      case "class_not_active":
        return { error: "아직 시작되지 않은 수업입니다." };
      case "invalid_credentials":
        return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
    }
  }

  await createSession(result.user);
  return { error: null };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
