import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { BadgeCheck, Instagram, ArrowUpRight } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="bg-surface-inverse text-on-surface-inverse py-16">
      <div className="container mx-auto max-w-content px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* 회사 정보 */}
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <Image
                src="/brand/sprout-felt-v1.webp"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11"
              />
              <span className="font-bold text-xl">유스핀랩</span>
            </Link>
            <div className="space-y-1.5 text-sm text-neutral-300">
              <p>사업자번호 281-22-02031 | 대표 고진주</p>
              <p>비즈니스 문의 contact@youthfinlab.com</p>
              <p>주소 서울특별시 강남구 테헤란로 70길 12, 402</p>
            </div>

            {/*
             * 여성기업 확인 배지.
             * 공공기관 발주 담당자가 수의계약 근거를 확인하는 정보라
             * 장식이 아니라 사업자 정보와 같은 묶음에 둔다.
             */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-700 py-2 pl-3 pr-4">
              <BadgeCheck
                aria-hidden
                className="h-4 w-4 shrink-0 text-neutral-300"
              />
              <p className="text-xs text-neutral-300">
                {/* "여성기업확인서"가 하나의 고유명사라 중간을 끊지 않는다. */}
                <span className="font-semibold text-on-surface-inverse">
                  여성기업확인서
                </span>{" "}
                제0118-2024-33844호
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="me noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-white/20 px-5 py-4 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              <Instagram className="h-5 w-5 text-[#5CC192]" />
              <span>
                인스타그램{" "}
                <span className="block text-xs font-normal text-neutral-300">
                  @youthfinlab
                </span>
              </span>
              <ArrowUpRight className="ml-4 h-4 w-4" />
              <span className="sr-only">새 창에서 열기</span>
            </a>
            {/* 메뉴 링크 */}
            <div className="flex flex-col md:flex-row gap-3">
              <Link
                href="/blog"
                className="text-neutral-300 hover:text-on-surface-inverse transition-colors"
              >
                블로그
              </Link>
              <Link
                href="/customer-support"
                className="text-neutral-300 hover:text-on-surface-inverse transition-colors"
              >
                고객지원
              </Link>
              <Link
                href="/education-inquiry"
                className="text-neutral-300 hover:text-on-surface-inverse transition-colors"
              >
                교육문의
              </Link>
            </div>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="mt-12 pt-6 border-t border-neutral-700">
          <p className="text-sm text-neutral-400 text-center md:text-left">
            Copyright © youthfinlab All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
