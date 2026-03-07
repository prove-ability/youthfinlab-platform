# finance-sim

재무 시뮬레이션 학생용 앱입니다. 학생이 본인의 재무 상태를 입력하고, 저축·투자 계획을 세우고, 연금을 설계하며, 투자 성향을 파악하는 4단계 시뮬레이션을 진행합니다.

**운영 URL**: https://finance-sim.youthfinlab.com

## 시뮬레이션 흐름

```
로그인 (수업 코드 + 아이디/비밀번호 or QR)
    │
    ▼
Step 1. 재무 프로필 입력
  - 나이, 재직 상태
  - 월 소득 / 월 고정 지출
  - 현금 자산 / 투자 자산
  - 부채 여부 및 금액
    │
    ▼
Step 2. 재무 스냅샷 확인
  - 월 여유자금, 저축 가능액 계산
  - 순자산 구성 시각화
    │
    ▼
Step 3. 저축·투자 계획
  - 월 납입액, 기간 설정
  - 저축 / 투자 비율 조정
  - 예상 수익률 입력 → 최종 자산 시뮬레이션
    │
    ▼
Step 4a. 연금 설계
  - 납입 시작 시점 (지금 / 5년 후 / 10년 후)
  - 월 납입액, 은퇴 연령 설정
  - 은퇴 시 예상 자산·월 연금 시뮬레이션
    │
    ▼
Step 4b. 투자 성향 분석
  - 5문항 설문
  - 안정형 / 안정추구형 / 위험중립형 / 적극투자형 / 공격투자형 분류
    │
    ▼
최종 리포트 확인
  - 전체 시뮬레이션 결과 요약 카드
```

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **인증**: 수업 코드 기반 세션 (쿠키 저장, `lib/session.ts`)
- **데이터베이스**: `@repo/db` (Drizzle ORM + Neon PostgreSQL)
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion
- **폼**: React Hook Form + Zod
- **차트**: Recharts
- **기타**: TanStack Query

## 개발 서버

```bash
pnpm --filter finance-sim dev
# http://localhost:3200
```

## 환경 변수

```env
DATABASE_URL=
```

## 인증 방식

Stack Auth를 사용하지 않고, 수업 코드 + 아이디/비밀번호 또는 QR 토큰으로 로그인합니다. 인증 세션은 HTTP-only 쿠키에 저장됩니다.

```
POST /login → 세션 쿠키 발급
GET  /qr-login?token=...&classId=... → QR 토큰 검증 후 세션 발급
```

모든 Server Action은 `withAuth` 래퍼(`lib/with-auth.ts`)로 세션을 검증합니다.

## 주요 디렉터리 구조

```
apps/finance-sim/
├── app/
│   ├── login/              # 로그인 페이지
│   ├── qr-login/           # QR 로그인 처리
│   └── simulation/
│       ├── profile/        # Step 1: 재무 프로필 입력
│       ├── snapshot/       # Step 2: 재무 스냅샷 확인
│       ├── investment/     # Step 3: 저축·투자 계획
│       ├── pension/        # Step 4a: 연금 설계
│       ├── tendency/       # Step 4b: 투자 성향 분석
│       └── report/         # 최종 리포트
├── actions/
│   ├── auth.ts             # 로그인·로그아웃 Server Actions
│   └── simulation.ts       # 시뮬레이션 데이터 CRUD Server Actions
├── contexts/
│   └── ToastContext.tsx     # 전역 토스트 알림
└── lib/
    ├── session.ts           # 세션 쿠키 관리
    └── with-auth.ts         # Server Action 인증 래퍼
```
