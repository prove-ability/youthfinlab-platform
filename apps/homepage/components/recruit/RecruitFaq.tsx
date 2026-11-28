"use client";

import Accordion from "@/components/ui/Accordion";
import { RECRUIT_FAQ } from "@/app/constants/recruit";

/**
 * 채용 FAQ.
 *
 * Accordion은 "use client" 모듈이라 서버 컴포넌트에서 Accordion.Item처럼
 * 점 접근을 하면 RSC 경계를 넘으며 undefined가 된다.
 * 페이지를 서버 컴포넌트로(=metadata를 쓸 수 있게) 유지하려고 이 블록만 분리한다.
 */
export default function RecruitFaq() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {RECRUIT_FAQ.map((faq, index) => (
        <Accordion.Item
          key={faq.question}
          value={`faq-${index}`}
          className="rounded-card border-none bg-background"
        >
          <Accordion.Trigger className="px-6 py-5 text-left hover:no-underline">
            <span className="font-medium">{faq.question}</span>
          </Accordion.Trigger>
          <Accordion.Content className="px-6 pb-5">
            <p className="leading-[1.85] text-muted-foreground">{faq.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
