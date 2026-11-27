# 회귀 테스트

저장소 루트에서 pnpm 9로 실행합니다.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm exec playwright install webkit
pnpm test:browser
pnpm test:hydration
```

Vitest는 프로젝트의 Drizzle 스키마로 메모리 PostgreSQL(PGlite)을 만들고 세 앱의 액션을 호출합니다. 관리자 인증, 학생 세션, Next.js 캐시 및 OpenAI 응답은 테스트 대역을 사용합니다. 세션 테스트는 별도로 실제 세션 모듈에 메모리 쿠키 저장소를 연결합니다.

Playwright는 모바일 크기의 WebKit에서 관리자 수업 생성, 실패 후 동일 클래스 재시도, QR 모달의 키보드 조작, 주식 앱 온보딩 및 시드 데이터 생성을 검증합니다. Vite로 실제 컴포넌트를 렌더링하고 서버 액션 응답을 제어합니다. 운영 계정이나 API 키는 필요하지 않습니다.

`test:hydration`은 실제 관리자 `Providers`·CSS·Button을 사용하는 별도 Next.js SSR 앱을 14315 포트에서 실행합니다. Chrome과 모바일 WebKit에서 JavaScript 실행 전 정적 스타일과 Emotion 태그 없음, 본문 기본값 유지, 초기 hydration·버튼 동작·클라이언트 이동·새로고침, 관리자 영역 밖으로 이동한 뒤 스타일 격리를 검증합니다. 로그인·DB 연결은 하지 않습니다. 단순 `createRoot` 미리보기에서는 잡히지 않는 서버/클라이언트 DOM 불일치를 검사합니다.

## 관리자 회귀 시나리오

- 여러 클래스를 가진 관리자의 개별 통계, 최근 학생, 최근 설문 조회와 대시보드 통합 조회를 검증합니다.
- 같은 일차의 같은 종목 가격을 다시 저장하면 기존 가격 행과 연결된 뉴스가 유지되는지 확인합니다.
- 초기 자본 거래가 있는 학생의 단건 삭제와 클래스 내 선택 삭제를 각각 검증합니다.
