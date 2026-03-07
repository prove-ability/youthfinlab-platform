# @repo/db

Drizzle ORM 기반의 공유 데이터베이스 레이어입니다. 모든 앱(`admin`, `stock-sim`, `finance-sim`)이 이 패키지를 통해 Neon PostgreSQL에 접근합니다.

## 사용법

```ts
import { db, classes, guests, financeSimulations } from "@repo/db";
import { eq } from "drizzle-orm";

const result = await db.query.classes.findMany({
  where: eq(classes.programType, "finance_sim"),
  with: { client: true },
});
```

## 스키마 구조

### 공통 (주식 게임 + 재무 시뮬레이션)

| 테이블 | 설명 |
|---|---|
| `clients` | 고객사 (기관) |
| `managers` | 고객사 소속 담당 매니저 |
| `classes` | 수업 클래스. `programType`으로 주식 게임/재무 시뮬레이션 구분 |
| `guests` | 학생 계정. 클래스에 속함 |

### 주식 투자 게임 전용

| 테이블 | 설명 |
|---|---|
| `stocks` | 종목 마스터 (이름, 섹터, 국가) |
| `classStockPrices` | 클래스·Day별 종목 주가 |
| `wallets` | 학생별 지갑 (잔고) |
| `transactions` | 매수·매도·지원금 거래 내역 |
| `news` | Day별 뉴스 이벤트 |
| `surveys` | 수업 만족도 설문 응답 |

### 재무 시뮬레이션 전용

| 테이블 | 설명 |
|---|---|
| `financeSimulations` | 시뮬레이션 세션 (학생 1명 = 1레코드) |
| `financeProfiles` | Step 1: 재무 프로필 (소득, 지출, 자산, 부채) |
| `savingsInvestmentResults` | Step 3: 저축·투자 계획 결과 |
| `pensionResults` | Step 4a: 연금 설계 결과 |
| `investmentTendencies` | Step 4b: 투자 성향 분석 결과 |

### Enum

| Enum | 값 |
|---|---|
| `program_type` | `stock_game`, `finance_sim` |
| `class_status` | `setting`, `active`, `ended` |
| `login_method` | `account`, `qr` |
| `transaction_type` | `deposit`, `withdrawal` |
| `transaction_sub_type` | `buy`, `sell`, `benefit` |
| `country_code` | `KR`, `US`, `JP`, `CN` |

## 마이그레이션

```bash
# 루트에서 실행
pnpm db:generate   # drizzle-kit으로 마이그레이션 파일 생성
pnpm db:migrate    # 마이그레이션 실행 (packages/db/src/migrate.ts)
```

## 파일 구조

```
packages/db/
├── src/
│   ├── schema.ts   # 전체 테이블·관계·enum 정의
│   ├── index.ts    # db 클라이언트 및 스키마 export
│   └── migrate.ts  # 마이그레이션 실행 스크립트
└── migrations/     # drizzle-kit 생성 마이그레이션 파일
```
