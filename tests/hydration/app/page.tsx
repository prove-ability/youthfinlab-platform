"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../apps/admin/src/components/ui/button";
export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <main className="yfl-admin-content yfl-editorial p-6">
      <h1>관리자 초기화 검증</h1>
      <p>기본 수업과 금융 위기 이벤트의 기존 디자인을 유지합니다.</p>
      <p>
        <strong>수업 상태</strong> · 검토용 샘플
      </p>
      <label htmlFor="name">수업명</label>
      <input
        id="name"
        className="border rounded-md p-2"
        defaultValue="금융 교육"
      />
      <Button onClick={() => setCount(count + 1)}>확인 {count}</Button>
      <Link href="/second">다음 화면</Link>
      <Link href="/outside">외부 화면</Link>
    </main>
  );
}
