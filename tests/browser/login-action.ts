export async function login(data: FormData) {
  if (
    data.get("classCode") !== "ABC123" ||
    data.get("loginId") !== "student" ||
    data.get("password") !== "fixture"
  ) {
    return { error: "로그인 정보를 확인해주세요." };
  }
  return { success: true };
}
