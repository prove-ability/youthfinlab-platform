# 관리자 MUI 제거와 React 초기화 오류 해결

## 원인

관리자 첫 접속에서 React #418이 발생했다. 실제 Providers를 사용하는 Next.js SSR 앱에서 인증·DB 없이 재현했으며, 클라이언트의 `<main>` 위치에 서버의 `<style data-emotion="css-global o6gwfi">`가 있다는 오류를 확인했다. MUI CssBaseline 전역 스타일의 위치가 hydration 과정에서 달라지는 것이 원인이었다.

## 최종 변경

- 관리자 ThemeProvider·CssBaseline과 PR 초기안의 AppRouterCacheProvider를 제거했다. QueryClient 옵션과 개발 도구는 그대로다.
- 주식 앱의 app/providers.tsx는 어디에서도 가져오지 않는 파일이었다. 이 파일도 제거했다. 주식·재무 앱의 실제 Provider 및 CSS는 변경하지 않았다.
- 루트 MUI material/icons, Emotion react/styled 및 관리자 cache/material-nextjs 직접 의존성을 제거했다. 잠금 파일에 MUI는 남아 있지 않다. Framer Motion이 사용하는 Emotion is-prop-valid/memoize 간접 의존성은 유지한다.
- Tailwind Preflight의 box-sizing·margin·텍스트 크기 초기화를 재사용한다. 관리자에서 측정한 본문 기본값(16px, 24px 줄간격, 400 굵기, 0.00938em 자간, Roboto/Helvetica/Arial, 흰 배경)을 기존 workspace.css에 보존했다. 폰트 교체는 이번 범위가 아니다.
- `body:has(.yfl-admin-content)`로 적용 범위를 제한해 인증 화면으로 이동한 뒤에도 관리자 본문 스타일이 남지 않게 했다. 강제 색상 조정은 끄지 않으며 인쇄·backdrop의 흰 배경도 유지했다. 기존 브랜드/컴포넌트 CSS는 유지한다.
- 로그인·거래·수업 모드·DB 로직과 스키마 변경 없음.

## 검증

- 실제 관리자 CSS와 Button을 포함한 1280px/390px 격리 화면에서 body/main/h1/p/strong/input/button의 글꼴·크기·줄간격·자간·굵기·색·배경·박스·여백·폭·높이가 제거 전후 동일했다.
- Chrome/모바일 WebKit 6개: JS 비활성화 SSR 스타일, Emotion 태그 없음, hydration 오류 없음, 버튼·이동·새로고침, 관리자 외부 이동 시 스타일 해제 검증.
- 세 앱 타입 검사, 서버 56개, 기존 UI 8개, frozen-lockfile 설치 통과.
- 실제 SSR production 빌드 후 동일 브라우저 검사 재실행. 원격 세 앱 빌드는 PR 체크에서 확인한다.
- 운영 데이터에 테스트 쓰기를 하지 않았다. PR은 검토용이며 운영 배포는 별도다.

## 지침

Modern Web Guidance `css`의 “No global resets”와 부모 조건 선택 원칙을 적용했다. 새 전역 `*` 초기화 없이 기존 Tailwind 규칙을 재사용하고, 널리 지원되는 :has()로 관리자 영역에만 기본값을 적용했다.
참고: https://react.dev/errors/418
