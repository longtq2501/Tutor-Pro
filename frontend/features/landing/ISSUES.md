# Landing Page - Issues & Optimization

- [ ] [P2-Medium] Testimonial Authenticity
  - Root cause: Hero and Testimonial sections use placeholder university names (VNU, USTH, etc.).
  - Target: Update with real user feedback or more professional "Coming Soon" styling if real testimonials are not yet collected.

## UI Issues
- [ ] [P2-Medium] Feature Showcase Sync
  - Root cause: Mock UI in `FeatureShowcase.tsx` (Calendar, Exam, Finance) looks slightly different from the actual high-performance dashboards implemented in `finance` and `calendar` modules.
  - Target: Update visuals to reflect "Stale-While-Revalidate" UI patterns and the new professional PDF/VietQR reports.

## Technical Debt (Optional)
- [ ] Refactor `FeatureShowcase.tsx`: The `features` array is getting large. Extract mock UI components into a separate `visuals/` directory.
- [ ] Environment Variable safety: `geminiService.ts` accesses `process.env.API_KEY` directly; should use a centralized config or check if it needs to be prefixed with `NEXT_PUBLIC_` for client-side use (Warning: Security).

---

## Completed Work (Archive)
- [x] [P0-Critical] Spline Pop-in Fix
  - Solution: Implemented `isSceneLoaded` state and `framer-motion` scale/opacity transition.
  - Performance impact: No abrupt "pop" during load.
  - Tested: ✅ Verified on Localhost.
- [x] [P1-High] Missing Core Feature: Live Teaching
  - Solution: Added "Lớp học Tương tác" section to `FeatureShowcase.tsx`. Extracted visuals to dedicated components and created `LiveTeachingVisual.tsx` showcasing whiteboard, chat, and billing.
  - Tested: ✅ Unit tests passed.
- [x] [P1-High] Spline 3D Model Optimization
  - Solution: Extracted logic to `SplineVisual.tsx`, implemented high-res placeholder (`next/image`), Error Boundary, and timeout fallback.
  - Performance impact: Perceived load time reduced by ~1.5s (immediate visual feedback).
  - Tested: ✅ Verified with manual throttling and lint.
- [x] [P1-High] Branding Inconsistency
  - Solution: Replaced "T" icon with `GraduationCap`, synchronized colors with system `--primary` token, and updated typography to "Tutor Pro" (title case).
  - Tested: ✅ Lint and Unit tests passed.
- [x] [P1-High] Next.js 15 Compatibility
  - Solution: Added `'use client'` to all interactive components and fixed unescaped entities.
  - Tested: ✅ Lint passed.
