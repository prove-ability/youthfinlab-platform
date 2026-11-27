"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  // 기본 라이트 테마 사용
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
        },
      }),
    [],
  );

  // React Query 클라이언트 (보수적 기본값으로 사이드 이펙트 방지)
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 60_000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    // Collect Emotion styles in <head> during streaming SSR so hydration sees
    // the same content tree. Keep the existing CSS key and cascade unchanged.
    <AppRouterCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          )}
        </QueryClientProvider>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
