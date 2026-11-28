import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: ReactNode;
}

/**
 * 타이포 스케일
 *
 * Display  히어로 전용, 페이지당 1회
 * H1       페이지 제목
 * H2       섹션 제목
 * H3       카드/블록 제목
 * H4       카드 내부 소제목
 * Lead     제목 바로 아래 부연
 * P        본문
 * Muted    보조 설명
 * Eyebrow  제목 위 라벨
 */

const Display: FC<Props> = ({ className, children }) => (
  <h1
    className={cn(
      "scroll-m-20 text-5xl/[1.55] font-bold tracking-[-0.03em] md:text-7xl/[1.55]",
      className
    )}
  >
    {children}
  </h1>
);

const H1: FC<Props> = ({ className, children }) => (
  <h1
    className={cn(
      "scroll-m-20 text-[2.5rem]/[1.55] font-bold tracking-[-0.03em] md:text-6xl/[1.55]",
      className
    )}
  >
    {children}
  </h1>
);

const H2: FC<Props> = ({ className, children }) => (
  <h2
    className={cn(
      "scroll-m-20 text-[2rem]/[1.55] font-bold tracking-[-0.03em] md:text-5xl/[1.55]",
      className
    )}
  >
    {children}
  </h2>
);

const H3: FC<Props> = ({ className, children }) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl/[1.5] font-bold tracking-[-0.02em] md:text-[1.75rem]/[1.5]",
      className
    )}
  >
    {children}
  </h3>
);

const H4: FC<Props> = ({ className, children }) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl/[1.6] font-semibold tracking-tight",
      className
    )}
  >
    {children}
  </h4>
);

const Eyebrow: FC<Props> = ({ className, children }) => (
  <p className={cn("text-sm font-semibold tracking-[0.08em]", className)}>
    {children}
  </p>
);

const Lead: FC<Props> = ({ className, children }) => (
  <p
    className={cn(
      "text-lg/[1.85] text-muted-foreground md:text-xl/[1.85]",
      className
    )}
  >
    {children}
  </p>
);

const P: FC<Props> = ({ className, children }) => (
  <p className={cn("leading-[1.9] [&:not(:first-child)]:mt-7", className)}>
    {children}
  </p>
);

const Large: FC<Props> = ({ className, children }) => (
  <div className={cn("text-lg font-semibold", className)}>{children}</div>
);

const Muted: FC<Props> = ({ className, children }) => (
  <p className={cn("text-sm leading-[1.8] text-subtle-foreground", className)}>
    {children}
  </p>
);

const Blockquote: FC<Props> = ({ className, children }) => (
  <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
    {children}
  </blockquote>
);

const InlineCode: FC<Props> = ({ className, children }) => (
  <code
    className={cn(
      "relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className
    )}
  >
    {children}
  </code>
);

const Label: FC<Props> = ({ className, children }) => (
  <label
    className={cn(
      "text-sm font-medium leading-none",
      "text-foreground/90",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      "select-none",
      "transition-colors",
      className
    )}
  >
    {children}
  </label>
);

export default Object.assign(
  {},
  {
    Display,
    H1,
    H2,
    H3,
    H4,
    Eyebrow,
    Lead,
    P,
    Large,
    Muted,
    Blockquote,
    InlineCode,
    Label,
  }
);
