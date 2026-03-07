# stock-sim

주식 투자 게임 학생용 앱입니다. 학생이 가상의 자금으로 주식을 매수·매도하며 Day 단위로 진행되는 투자 시뮬레이션을 체험합니다.

**운영 URL**: https://invest-game.youthfinlab.com

## 게임 흐름

```
로그인 (수업 코드 + 아이디/비밀번호 or QR)
    │
    ▼
온보딩 / 닉네임 설정
    │
    ▼
메인 화면 (포트폴리오 현황)
  - 보유 현금·주식 평가액·수익률 확인
  - 종목별 매수·매도
    │
    ▼
뉴스 (Day별 이벤트 확인)
    │
    ▼
분석 (종목 차트 및 기술적 분석)
    │
    ▼
랭킹 (클래스 내 수익률 순위)
    │
    ▼
(관리자가 Day 진행) → 다음 Day 반복
```

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **인증**: 수업 코드 기반 세션 (쿠키 저장)
- **데이터베이스**: `@repo/db` (Drizzle ORM + Neon PostgreSQL)
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion
- **차트**: Recharts
- **기타**: TanStack Query, driver.js (온보딩 투어)

## 개발 서버

```bash
pnpm --filter stock-sim dev
# http://localhost:3000
```

## 환경 변수

```env
DATABASE_URL=
```

## 인증 방식

수업 코드 + 아이디/비밀번호 또는 QR 토큰으로 로그인합니다. 인증 세션은 HTTP-only 쿠키에 저장됩니다.

```
POST /login → 세션 쿠키 발급
GET  /qr-login?token=...&classId=... → QR 토큰 검증 후 세션 발급
```

## 주요 디렉터리 구조

```
apps/stock-sim/
├── app/
│   ├── login/          # 로그인
│   ├── qr-login/       # QR 로그인 처리
│   ├── onboarding/     # 온보딩 투어
│   ├── setup/          # 닉네임 설정
│   ├── invest/         # 주식 매수·매도
│   ├── news/           # Day별 뉴스 이벤트
│   ├── analysis/       # 종목 분석·차트
│   └── ranking/        # 수익률 랭킹
├── actions/            # Server Actions
├── components/         # 공유 컴포넌트
├── contexts/           # 전역 컨텍스트
├── hooks/              # 커스텀 hooks
└── lib/
    └── session.ts      # 세션 쿠키 관리
```
