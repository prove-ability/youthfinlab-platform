"use client";

interface DescriptionProps {
  description: string;
}

export function Description({ description }: DescriptionProps) {
  // img 태그를 삭제
  let processed = description.replace(/<img[^>]*>/g, "");
  // 마침표+공백 뒤에 <br /> 추가
  processed = processed.replace(/\. /g, ".<br />");

  return (
    <div className="mb-8" dangerouslySetInnerHTML={{ __html: processed }} />
  );
}
