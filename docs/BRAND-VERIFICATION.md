# 브랜드 적용 검수 · 2026-11-26

## 적용 범위

승인된 펠트 새싹 원본과 공통 색상·간격 토큰을 두 학습 앱의 로그인 및 관리자 대시보드 환영 영역에 적용했다. 인증 핸들러, 서버 액션, 거래 계산, 데이터 모델은 변경하지 않았다. 기존 디자인 작업 커밋 e0b6304를 이어서 검수했다.

## 실행 결과

| 검사 | 결과 |
|---|---|
| `node node_modules/vitest/vitest.mjs run` | 39/39 통과 |
| `node node_modules/@playwright/test/cli.js test` | WebKit 8/8 통과; 모의 서버 액션 사용 |
| 각 앱의 `tsc --noEmit -p apps/<app>/tsconfig.json` | stock-sim, finance-sim, admin 통과 |
| 각 학습 앱에서 `node ../../node_modules/next/dist/bin/next build --webpack` | stock-sim, finance-sim 통과 |
| 관리자 동일 빌드 | 컴파일·타입 검사 후 페이지 데이터 수집 실패: 로컬 NEXT_PUBLIC_STACK_PROJECT_ID 미설정 |

실제 운영 계정 로그인이나 운영 DB 변경을 실행하지 않았다. 관리자 인증을 포함한 전체 실행 검증은 올바른 Stack Auth 환경에서 별도로 필요하다. 저장소의 기존 next lint 스크립트는 실행 결과로 포함하지 않았다.

## 화면 확인

Chrome DevTools 연결은 기존 프로필 충돌로 실패했다. 사용자 브라우저를 종료하지 않고 Codex 앱 내 브라우저로 확인했다. 로컬 서버의 Windows 소켓 제한을 해소한 실행 환경에서 실제 Next.js 로그인 페이지를 확인했다.

- 주식·재무 로그인: 데스크톱과 390px 모바일에서 확인. 모바일 문서 폭과 뷰포트 폭 모두 390px로 가로 넘침 없음.
- 관리자: 실제 DashboardClient에 빈 통계 데이터를 공급한 로컬 컴포넌트 프리뷰. 인증된 전체 앱 화면이 아님.
- 관리자 다크 모드는 공통 환영 영역만 확인했다. 전체 대시보드 다크 모드 검증으로 간주하지 않는다.

| 화면 | 데스크톱 | 모바일 |
|---|---|---|
| 주식 로그인 | [캡처](brand-evidence/stock-desktop.jpg) | [캡처](brand-evidence/stock-mobile.jpg) |
| 재무 로그인 | [캡처](brand-evidence/finance-desktop.jpg) | [캡처](brand-evidence/finance-mobile.jpg) |
| 관리자 컴포넌트 프리뷰 | [캡처](brand-evidence/admin-desktop.jpg) | [캡처](brand-evidence/admin-mobile.jpg) |

## 웹 가이드 적용

Modern Web Guidance의 color 가이드를 검색·조회했다. “Maintain 4.5:1 for normal text and 3:1 for large text”, “Don't use color alone” 지침에 따라 밝은 세이지 위 진한 텍스트, 진한 주요 버튼, 기존 오류 문구를 유지했다. 키보드 포커스 및 forced-colors 시스템 색상 대응을 추가했다. 전체 WCAG 인증이나 고대비 모드 실기 검증을 의미하지 않는다.

## 검토·배포

이 변경은 PR 검토까지 진행한다. 병합·운영 배포는 수행하지 않았다. 브랜드 정의와 이미지 생성 프롬프트는 [BRAND-DIRECTION.md](BRAND-DIRECTION.md)에 있다.

## 공통 UI 후속 정리

관리자 통계 카드는 중립 배경·포레스트 숫자로 통일하고 활성 게임만 세이지 배경으로 강조했다. 서베이·최근 활동 패널에도 같은 토큰을 적용했다. 학습 앱에는 아이보리 배경, 카드 경계, 입력창 경계·포커스, 주요 안내 버튼 및 선택된 하단 내비게이션을 적용했다. 매수·매도·손익·오류의 의미 색상과 처리 로직은 유지했다.

후속 검증: Vitest 39개, WebKit 회귀 8개, 세 앱 타입 검사, 주식·재무 production build 통과. 관리자·재무 기본정보·주식 온보딩의 실제 컴포넌트 샘플을 1280px/390px에서 확인했으며 모바일 가로 넘침 및 pageerror 없음. 샘플의 저장·이동 액션은 목 처리했으므로 운영 인증·거래 검증이 아니다. 이전 커밋 ddc8fbf의 관리자 Vercel 빌드는 성공했으며 후속 커밋 결과는 PR 상태에서 확인한다.

- [관리자 데스크톱](brand-evidence/admin-refined-desktop.png) / [모바일](brand-evidence/admin-refined-mobile.png)
- [재무 기본정보 데스크톱](brand-evidence/finance-refined-desktop.png) / [모바일](brand-evidence/finance-refined-mobile.png)
- [주식 온보딩 데스크톱](brand-evidence/stock-refined-desktop.png) / [모바일](brand-evidence/stock-refined-mobile.png)
