# crowed-rank

유스핀랩 교육 플랫폼 모노레포입니다. 주식 투자 게임과 재무 시뮬레이션 두 가지 프로그램을 운영하며, 관리자 대시보드에서 통합 관리합니다.

## 프로젝트 구조

```
crowed-rank/
├── apps/
│   ├── admin/          # 관리자 대시보드 (포트 3100)
│   ├── stock-sim/      # 주식 투자 게임 - 학생용 (포트 3000)
│   └── finance-sim/    # 재무 시뮬레이션 - 학생용 (포트 3200)
├── packages/
│   ├── db/             # @repo/db — Drizzle ORM + Neon PostgreSQL
│   ├── ui/             # @repo/ui — 공유 UI 컴포넌트
│   ├── hooks/          # @repo/hooks — 공유 React hooks
│   ├── utils/          # @repo/utils — 공유 유틸리티 함수
│   ├── eslint-config/  # 공유 ESLint 설정
│   └── typescript-config/ # 공유 TypeScript 설정
├── turbo.json
└── package.json
```

## 앱 설명

| 앱 | URL (운영) | 역할 |
|---|---|---|
| `admin` | — | 관리자 전용 대시보드. 클래스·고객사·학생 관리, 결과 분석 |
| `stock-sim` | https://invest-game.youthfinlab.com | 주식 투자 게임. 학생이 가상 주식을 매수·매도하며 투자를 체험 |
| `finance-sim` | https://finance-sim.youthfinlab.com | 재무 시뮬레이션. 재무 상태 진단, 저축·투자 계획, 연금 설계, 투자 성향 분석 |

## 기술 스택

- **프레임워크**: Next.js 15 (App Router), React 19
- **모노레포**: Turborepo + pnpm workspaces
- **데이터베이스**: Neon PostgreSQL + Drizzle ORM
- **인증**: Stack Auth (`apps/admin`), 수업 코드 기반 세션 (`apps/stock-sim`, `apps/finance-sim`)
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **언어**: TypeScript

## 시작하기

### 사전 요구사항

- Node.js >= 20
- pnpm >= 9

### 설치

```bash
pnpm install
```

### 환경 변수 설정

각 앱 디렉터리의 `.env.local.example`을 참고하여 `.env.local`을 작성합니다.

**`apps/admin/.env.local`**
```env
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=
DATABASE_URL=
GEMINI_API_KEY=
NEXT_PUBLIC_WEB_APP_URL=https://invest-game.youthfinlab.com
NEXT_PUBLIC_FINANCE_SIM_APP_URL=https://finance-sim.youthfinlab.com
```

**`apps/stock-sim/.env.local`** / **`apps/finance-sim/.env.local`**
```env
DATABASE_URL=
```

### 개발 서버 실행

```bash
# 전체 앱 동시 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter admin dev
pnpm --filter stock-sim dev
pnpm --filter finance-sim dev
```

### 빌드

```bash
pnpm build
```

### DB 마이그레이션

```bash
# 마이그레이션 파일 생성
pnpm db:generate

# 마이그레이션 실행
pnpm db:migrate
```

## 주요 워크플로

### 수업 생성 → 학생 접속 흐름

1. **관리자**가 `admin`에서 클래스를 생성합니다 (프로그램 유형: 주식 게임 or 재무 시뮬레이션).
2. **관리자**가 학생 계정을 생성하고 QR 코드를 발급합니다.
3. **학생**이 QR 코드를 스캔하거나 수업 코드 + 계정으로 직접 로그인합니다.
4. 학생은 해당 프로그램(주식 게임 or 재무 시뮬레이션)을 진행합니다.
5. **관리자**는 대시보드에서 실시간 진행 현황과 결과를 확인합니다.
