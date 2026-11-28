import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
// 클라이언트 컴포넌트. three.js는 그 안에서 동적 import되므로
// 초기 번들에는 들어가지 않는다.
import BlobCanvas from "./BlobCanvas";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] flex-col items-center overflow-hidden bg-surface-sunken pt-[14vh]">
      {/*
       * 3D 블롭 두 덩어리가 좌상단·우하단에서 화면을 대각선으로 감싼다.
       * 가운데를 비워 텍스트는 깨끗한 배경 위에 놓인다.
       * 캔버스 하나에 메시 둘을 넣어 WebGL 컨텍스트는 하나만 쓴다.
       */}
      <BlobCanvas className="pointer-events-none absolute inset-0 -z-10" />

      <div className="container mx-auto max-w-content px-6 text-center">
        <Typography.Display className="text-foreground">
          모두를 위한
          <br />
          금융의 시작
        </Typography.Display>

        {/* 쉼표에서 끊어 두 줄 길이를 비슷하게 맞춘다 */}
        <Typography.Lead className="mx-auto mt-7 text-balance">
          금융지식이 만드는 큰 변화,
          <br />
          금융교육 전문기업 유스핀랩과 함께하세요
        </Typography.Lead>

        {/* 모바일에서는 탭 영역 확보를 위해 버튼을 전체 폭으로 */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 max-md:flex-col">
          <Button
            size="xl"
            className="shadow-lg hover:shadow-xl max-md:w-full"
            asChild
          >
            <Link href="/education-inquiry">
              교육 문의하기
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" size="xl" className="max-md:w-full" asChild>
            <Link href="/blog">자세히 보기</Link>
          </Button>
        </div>
      </div>

      {/* 아래로 이동. CSS scroll-behavior로 부드럽게 움직인다 */}
      <a
        href="#mission"
        aria-label="아래 내용 보기"
        className="absolute bottom-6 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-on-panel/50 transition-colors hover:bg-background/60 hover:text-on-panel focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronDown className="h-6 w-6 animate-bounce [animation-duration:2.5s] motion-reduce:animate-none" />
      </a>
    </section>
  );
}
