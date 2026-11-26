import { expect, test } from "@playwright/test";

for (const app of ["stock", "finance"] as const) {
  test(
    app + " login preserves validation and destination",
    async ({ page }) => {
      await page.goto("/tests/browser/index.html?" + app + "-login");
      await expect(
        page.getByText("선생님께 받은 계정 정보로 로그인하세요"),
      ).toBeVisible();
      const password = page.getByLabel("비밀번호", { exact: true });
      await expect(password).toHaveAttribute(
        "autocomplete",
        "current-password",
      );
      await expect(page.getByLabel("아이디")).toHaveAttribute(
        "autocomplete",
        "username",
      );
      if (app === "stock") {
        await page.getByRole("button", { name: "비밀번호 보기" }).click();
        await expect(password).toHaveAttribute("type", "text");
        await page.getByRole("button", { name: "비밀번호 숨기기" }).click();
        await expect(password).toHaveAttribute("type", "password");
      }
      for (const value of ["wrong", "fixture"]) {
        if (value === "fixture") await page.reload();
        await page.getByLabel("수업 코드").fill("ABC123");
        await page.getByLabel("아이디").fill("student");
        await password.fill(value);
        await page.getByRole("button", { name: "로그인하기" }).click();
        if (value === "wrong")
          await expect(page.getByRole("alert")).toHaveText(
            "로그인 정보를 확인해주세요.",
          );
      }
      await expect(page).toHaveURL(
        app === "stock" ? "/setup" : "/simulation/profile",
      );
    },
  );
}
