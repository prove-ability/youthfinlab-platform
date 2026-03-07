# admin

유스핀랩 관리자 대시보드입니다. 주식 투자 게임과 재무 시뮬레이션 두 프로그램을 통합 관리합니다.

## 기능

### 대시보드
- 전체 클라이언트·클래스·학생 수, 활성 게임 현황 요약
- 최근 등록 학생 목록
- 설문 응답 통계 및 평균 만족도

### 클래스 관리
- 클래스 생성 시 프로그램 유형 선택 (주식 투자 게임 / 재무 시뮬레이션)
- 클래스 상태 관리 (설정 중 → 진행 중 → 종료)
- QR 코드 발급 (프로그램 유형에 따라 올바른 앱 URL로 생성)
- 학생 계정 생성 및 관리

### 고객사 · 매니저 관리
- 고객사(기관) 등록 및 삭제
- 고객사별 담당 매니저 관리

### 주식 게임 관리
- 게임 데이터(종목·주가) 자동/수동 생성 (Gemini AI 활용)
- Day 진행 및 결과 조회

### 재무 시뮬레이션 결과 조회
- 클래스별 시뮬레이션 완료 현황
- 프로필 통계 (평균 소득·지출, 부채 비율)
- 저축·투자 성향 분포
- 연금 기여 통계
- 학생 개별 리포트 상세 조회

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **인증**: Stack Auth
- **데이터베이스**: `@repo/db` (Drizzle ORM + Neon PostgreSQL)
- **UI**: Tailwind CSS, Radix UI, shadcn/ui, Recharts
- **AI**: Google Gemini API (게임 데이터 자동 생성)
- **기타**: TanStack Query, TanStack Table, DnD Kit, QRCode.react

## 개발 서버

```bash
pnpm --filter admin dev
# http://localhost:3100
```

## 환경 변수

```env
# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

# Neon PostgreSQL
DATABASE_URL=

# Google Gemini (게임 데이터 자동 생성)
GEMINI_API_KEY=

# 앱 URL (QR 코드 생성에 사용)
NEXT_PUBLIC_WEB_APP_URL=https://invest-game.youthfinlab.com
NEXT_PUBLIC_FINANCE_SIM_APP_URL=https://finance-sim.youthfinlab.com
```

## 주요 디렉터리 구조

```
apps/admin/
├── app/
│   └── protected/
│       ├── dashboard/          # 메인 대시보드
│       ├── classes/            # 클래스 관리
│       ├── clients/            # 고객사·매니저 관리
│       ├── game-management/    # 주식 게임 관리
│       └── finance-sim/        # 재무 시뮬레이션 결과 조회
├── src/
│   └── actions/                # Server Actions
│       ├── classActions.ts
│       ├── financeSimActions.ts
│       └── ...
└── lib/
    └── safe-action.ts          # withAuth 래퍼
```

## Server Actions 인증

모든 Server Action은 `withAuth` 래퍼로 Stack Auth 세션을 검증합니다. 미인증 요청은 에러를 반환합니다.

```ts
export const myAction = withAuth(async (user) => {
  // user: Stack Auth 세션 유저
});
```
