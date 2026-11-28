import { cn } from "@/lib/utils";
import { ReactNode, FC, ElementType } from "react";

type SectionSize = "none" | "base" | "sm" | "md" | "lg";

type SectionBackground =
  | "default"
  | "muted"
  | "accent"
  | "brand"
  /** 위는 배경색, 아래로 갈수록 옅은 브랜드 그린 */
  | "fade-to-brand"
  /** 위는 옅은 브랜드 그린, 아래로 갈수록 배경색 */
  | "fade-from-brand";

interface SectionProps {
  children: ReactNode;
  /** 앵커 이동 대상으로 쓸 때 지정한다 */
  id?: string;
  as?: ElementType;
  className?: string;
  containerClassName?: string;
  size?: SectionSize;
  background?: SectionBackground;
  /** 컨테이너 없이 자식이 전체 폭을 쓰게 한다 */
  bleed?: boolean;
  /**
   * 컨테이너 바깥, 섹션 바로 아래 놓이는 장식 레이어.
   * absolute 위치가 섹션 기준으로 잡히도록 섹션이 relative가 된다.
   * 콘텐츠보다 뒤에 깔리므로 z-index를 따로 줄 필요가 없다.
   */
  decoration?: ReactNode;
}

const sizeStyles: Record<SectionSize, string> = {
  none: "",
  base: "py-20",
  sm: "py-20 md:py-24",
  md: "py-24 md:py-32",
  lg: "py-20 md:py-28",
};

const backgroundStyles: Record<SectionBackground, string> = {
  default: "bg-background",
  muted: "bg-muted",
  accent: "bg-accent",
  brand: "bg-panel text-on-panel",
  "fade-to-brand": "bg-linear-to-b/srgb from-background to-brand-600/5",
  "fade-from-brand": "bg-linear-to-b/srgb from-brand-600/5 to-background",
};

const Section: FC<SectionProps> = ({
  children,
  id,
  as: Tag = "section",
  className,
  containerClassName,
  size = "base",
  background = "default",
  bleed = false,
  decoration,
}) => {
  return (
    <Tag
      id={id}
      className={cn(
        sizeStyles[size],
        backgroundStyles[background],
        decoration && "relative isolate overflow-hidden",
        className
      )}
    >
      {decoration}
      {bleed ? (
        children
      ) : (
        <div
          className={cn(
            "container mx-auto max-w-content px-6",
            decoration && "relative",
            containerClassName
          )}
        >
          {children}
        </div>
      )}
    </Tag>
  );
};

export default Section;
