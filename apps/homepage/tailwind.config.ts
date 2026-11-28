import legacyPalette from "./lib/legacy-palette.json";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      RixYeoljeongdo_Regular: ["RixYeoljeongdo_Regular"],
    },
    extend: {
      colors: {
        ...legacyPalette,
        brand: {
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },
        "on-brand": "hsl(var(--on-brand))",
        "brand-accent": "hsl(var(--brand-accent))",
        panel: {
          DEFAULT: "hsl(var(--panel))",
          strong: "hsl(var(--panel-strong))",
        },
        "on-panel": "hsl(var(--on-panel))",
        "panel-accent": "hsl(var(--panel-accent))",
        "surface-inverse": "hsl(var(--surface-inverse))",
        "surface-sunken": "hsl(var(--surface-sunken))",
        "on-surface-inverse": "hsl(var(--on-surface-inverse))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "subtle-foreground": "hsl(var(--subtle-foreground))",
        "faint-foreground": "hsl(var(--faint-foreground))",
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          strong: "hsl(var(--border-strong))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // 의미 기반 radius. 값은 기존 화면과 동일하게 유지한다.
        control: "0.75rem", // 버튼·입력 (기존 rounded-xl)
        card: "1rem", // 카드 (기존 rounded-2xl)
        panel: "1.5rem", // 대형 패널 (기존 rounded-3xl)
      },
      maxWidth: {
        content: "72rem",
      },
      animation: {
        // 마퀴는 읽을 수 있을 만큼 느리게. 카드가 넓은 후기 줄은 더 느리게 간다.
        scroll: "scroll 60s linear infinite",
        "scroll-slow": "scroll 90s linear infinite",
        // 기본 pulse는 주기가 짧고 opacity가 0.5까지 떨어져 산만하다.
        // 주기를 늘리고 진폭을 줄여 존재감만 남긴다.
        "pulse-slow": "soft-pulse 6s ease-in-out infinite",
        "ping-slow": "ping 4s cubic-bezier(0, 0, 0.2, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "soft-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        scroll: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-100%)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
export default config;
