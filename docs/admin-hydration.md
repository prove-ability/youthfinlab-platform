# 관리자 React 초기화 오류

## 재현과 원인

운영 관리자에서 React #418이 발생했다. 실제 `apps/admin/app/providers.tsx`를 별도 Next.js SSR 앱에 연결해 인증이나 DB 없이 같은 오류를 재현했다. Chrome DevTools 개발 오류에는 클라이언트의 `<main>` 위치에 서버의 `<style data-emotion="css-global o6gwfi">`가 있었다고 표시됐다.

관리자의 MUI CssBaseline/Emotion 전역 스타일에 App Router SSR 캐시가 없어 스타일 태그의 위치가 hydration 시점에 달라졌다. 기존 CSR 전용 테스트는 서버 HTML을 hydration하지 않아 발견하지 못했다.

## 수정 범위

- 관리자 Providers에 공식 `@mui/material-nextjs/v16-appRouter`의 AppRouterCacheProvider를 추가해 서버 생성 스타일을 head에 수집한다.
- 기존 `css` 캐시 키와 라이트 테마/CssBaseline, CSS layer 설정, React Query 옵션을 유지한다. 새로운 suppressHydrationWarning이나 SSR 비활성화를 추가하지 않는다.
- Next.js 16을 지원하는 material-nextjs 7.3.10과 Emotion cache를 관리자에만 추가한다. 기존 의존성 버전은 유지한다.
- 서버 액션, 인증, 거래, 수업 모드, DB 스키마 변경 없음.

## 검증

- 변경 전: 동일 Providers의 실제 Next SSR에서 hydration 오류 재현.
- 변경 후: Chrome/모바일 WebKit 회귀 4개 통과. JS 비활성화 상태의 head 스타일·SSR 본문, 흰 배경, hydration 오류 없음, 버튼·페이지 이동·새로고침 확인.
- Chrome DevTools에서 새로고침 후 콘솔 오류·경고 없음.
- 관리자 타입 검사, 서버 테스트 56개, 기존 브라우저 회귀 8개 통과. frozen-lockfile 설치 통과.
- 격리 SSR 앱 production 빌드 후 같은 브라우저 검사 4개 재실행 통과.
- 운영 배포는 이 PR 범위에 포함하지 않는다. 인증된 운영 화면 최종 확인은 병합·배포 후 필요하다.

참고: https://mui.com/material-ui/integrations/nextjs/ (App Router cache), https://react.dev/errors/418
Modern Web Guidance에서 SSR hydration/initial DOM을 검색했으나 React/Emotion에 직접 적용할 가이드는 없어 공식 MUI/React 문서를 기준으로 수정했다.
