"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BRAND } from "@/lib/brand";
import { Moon, Sun, Instagram } from "lucide-react";
import Button from "@/components/ui/Button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { resolvedTheme, systemTheme, setTheme } = useTheme();

  const handleClick = () => setIsOpen(!isOpen);
  const toggleTheme = () => {
    const target = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(target === systemTheme ? "system" : target);
  };

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-6">
        <div className="flex">
          <Link
            className="flex shrink-0 items-center gap-2"
            aria-label="유스핀랩 홈"
            href="/"
          >
            <span
              className="font-bold"
              style={{ fontFamily: "RixYeoljeongdo_Regular" }}
            >
              youthfinlab
            </span>
          </Link>
        </div>
        {/* 데스크톱 네비게이션 */}
        {/* 항목이 늘어 md 폭에서는 간격을 좁히고 lg부터 원래 간격으로 벌린다. */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          <Link href="/mock-investment">모의투자체험</Link>
          <Link href="/financial-consulting">재무상담</Link>
          <Link href="/blog">블로그</Link>
          <Link href="/customer-support">고객지원</Link>
          <Link href="/recruit">인재채용</Link>
          <Button asChild>
            <Link href="/education-inquiry">교육문의</Link>
          </Button>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="유스핀랩 인스타그램 (새 창)"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong hover:bg-accent"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
            aria-label="테마 변경"
          >
            <div className="relative w-4 h-4">
              <Sun className="absolute inset-0 h-4 w-4 transition-transform scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute inset-0 h-4 w-4 transition-transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
            </div>
          </Button>
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={toggleTheme}
            className="mr-4 p-2 rounded-md hover:bg-accent hover:text-accent-foreground relative"
            aria-label="테마 변경"
          >
            <div className="relative w-4 h-4">
              <Sun className="absolute inset-0 h-4 w-4 transition-transform scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute inset-0 h-4 w-4 transition-transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
            </div>
          </button>
          <button
            ref={menuButton}
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={handleClick}
            className="flex h-11 w-11 flex-col justify-center items-center"
          >
            <span
              className={`bg-foreground block transition-all duration-300 ease-out
                    h-0.5 w-6 rounded-sm ${
                      isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                    }`}
            ></span>
            <span
              className={`bg-foreground block transition-all duration-300 ease-out
                    h-0.5 w-6 rounded-sm my-0.5 ${
                      isOpen ? "opacity-0" : "opacity-100"
                    }`}
            ></span>
            <span
              className={`bg-foreground block transition-all duration-300 ease-out
                    h-0.5 w-6 rounded-sm ${
                      isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                    }`}
            ></span>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div
        className={`lg:hidden ${
          isOpen ? "block" : "hidden"
        } absolute top-16 left-0 right-0 bg-background border-b`}
      >
        <nav
          id="mobile-navigation"
          aria-label="모바일 메뉴"
          onClick={() => setIsOpen(false)}
          className="container mx-auto px-6 py-4"
        >
          <Link
            href="/mock-investment"
            className="block py-2 text-sm hover:text-muted-foreground transition-colors"
          >
            모의투자체험
          </Link>
          <Link
            href="/financial-consulting"
            className="block py-2 text-sm hover:text-muted-foreground transition-colors"
          >
            재무상담
          </Link>
          <Link
            href="/blog"
            className="block py-2 text-sm hover:text-muted-foreground transition-colors"
          >
            블로그
          </Link>
          <Link
            href="/customer-support"
            className="block py-2 text-sm hover:text-muted-foreground transition-colors"
          >
            고객지원
          </Link>
          <Link
            href="/recruit"
            className="block py-2 text-sm hover:text-muted-foreground transition-colors"
          >
            인재채용
          </Link>
          <Link
            href="/education-inquiry"
            className="block py-2 text-sm hover:text-muted-foreground transition-colors"
          >
            교육문의
          </Link>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="me noopener noreferrer"
            className="flex items-center gap-2 py-3 text-sm font-semibold"
          >
            <Instagram className="h-4 w-4" />
            인스타그램<span className="sr-only"> (새 창)</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
