"use client";

import { FormEvent, useState } from "react";
import { createManager } from "@/actions/managerActions";
import { Manager } from "@/types/manager";
import { Button } from "@repo/ui";

export function AddManagerForm({
  clientId,
  onManagerAdded,
}: {
  clientId: string;
  onManagerAdded: (manager: Manager) => void;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile_phone", mobile);
    formData.append("email", email);
    const result: any = await createManager(clientId, formData);
    setLoading(false);
    if (
      result &&
      typeof result === "object" &&
      "error" in result &&
      result.error
    ) {
      setError(
        typeof result.error === "string"
          ? result.error
          : Object.values(result.error).flat().join(", ")
      );
    } else {
      setMsg(result.message);
      setName("");
      setMobile("");
      setEmail("");
      // 새로 추가된 매니저를 부모 컴포넌트에 전달
      if (result && result.data) {
        onManagerAdded(result.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 rounded-lg border border-dashed border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        매니저 추가
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-xs text-gray-500 font-medium">
            이름 <span className="text-red-400">*</span>
          </label>
          <input
            className="border border-gray-200 bg-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="홍길동"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-xs text-gray-500 font-medium">
            휴대폰 번호
          </label>
          <input
            className="border border-gray-200 bg-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="010-0000-0000"
            id="phone"
            name="phone"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs text-gray-500 font-medium">
            이메일
          </label>
          <input
            className="border border-gray-200 bg-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="example@email.com"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          {msg && <p className="text-green-600 text-xs">{msg}</p>}
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
        <Button type="submit" disabled={loading} className="h-8 px-4 text-xs">
          {loading ? "저장 중..." : "매니저 저장"}
        </Button>
      </div>
    </form>
  );
}
