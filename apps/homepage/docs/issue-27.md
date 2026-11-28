# Issue 27 — homepage reliability

Scope: preserve the approved wordmark, animated hero, sprout inquiry control and educational copy. Instagram content work remains deferred in issue 26 / draft PR 25.

Changes: resolved system theme toggle; 44px mobile menu target, Escape close with focus return; RSS 0/1/many normalization, malformed-item filtering, upstream status and 8-second timeout; reduced-motion resize redraw and live preference changes; inquiry link fallback until ChannelTalk boot succeeds (no duplicate SDK launcher handler).

Validation: lint and TypeScript passed; 8 regression tests passed including actual RSS route execution for 0/1/many, invalid XML, upstream failure and timeout. IAB verified system-dark first click to light, mobile menu open/Escape/focus return, reduced-motion canvas repaint after 390px resize, and inquiry fallback navigation. No form submitted. ChannelTalk production success path requires its real plugin configuration; local preview intentionally has no service credentials.

Self-review: motion listener/observer/RAF cleaned up; original layout/copy preserved; no dependency changes. Production build recorded in PR. No merge or production release in this task.

Modern Web Guidance: retrieved motion, dark-mode-toggle and dark-mode. Kept next-themes and existing CSS tokens; toggle chooses the opposite rendered scheme and returns to system when the target matches the OS. Motion preference changes retain a visible static frame and redraw it on resize. No new experimental APIs or dependencies. Broader redesign of existing animations/theme styling is outside this issue.
