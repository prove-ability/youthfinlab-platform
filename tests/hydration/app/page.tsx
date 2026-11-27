"use client";
import { useState } from "react";
import Link from "next/link";
export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>관리자 초기화 검증</h1>
      <button onClick={() => setCount(count + 1)}>확인 {count}</button>
      <Link href="/second">다음 화면</Link>
    </main>
  );
}
