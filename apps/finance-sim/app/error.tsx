"use client";
import { LoadError } from "@repo/ui/async-state";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <LoadError onRetry={reset} />;
}
