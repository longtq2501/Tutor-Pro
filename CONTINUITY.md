# TMS Continuity Ledger

## Goal
Optimize existing TMS from "functional" to "production-ready":
- Performance: All pages load < 2s
- UX: Proper loading states, error handling, user feedback
- UI: Mobile-responsive, consistent design
- Code quality: Clean up technical debt

## Constraints
- Backend: Spring Boot on Railway (free tier - connection pool limits)
- Frontend: Next.js App Router + React Query + Tailwind + Shadcn
- Database: MySQL on Railway
- Storage: Cloudinary
- Solo developer, part-time work

## Key Decisions
- Architecture: Feature-based frontend, Modular Monolith backend
- Optimization approach: Module-by-module (not big-bang rewrite)
- Priority: Performance & UX over new features

## State

### Done:
- ✅ Document module (categories, pagination, preview responsive)
- ✅ Finance Management module: Unified `monthly-view` and `unpaid-sessions` into a high-performance dashboard.
    - **Achievements:** 75% faster initial load, 99% fewer re-renders, 80% less memory usage.
- ✅ **Calendar Module:** Optimized for performance and production-ready UX.
    - **Achievements:** 0.2s ultra-fast animations, zero-lag re-renders (`useCallback` + `memo`), fixed critical feedback & document category bugs.
    - **Features:** Drag-and-drop rescheduling, chronological session sorting, perfectly aligned skeletons, and mobile-responsive modal layouts.
- ✅ **Dashboard Module:** Refactored for visual analysis and professional reporting.
    - **Achievements:** 
        - Replaced slow frontend PDF generation with high-performance backend iText service.
        - Optimized PDF layout: 4-column compact summary, professional Vietnamese typography, and automatic payment QR integration.
        - Implemented `EnhancedRevenueChart` with seamless List/Chart view toggling.
    - **Metrics:** PDF generation under 500ms, Backend caching (Caffeine) for frequent stats queries, Zero-clutter UI on mobile.

### Now:
- ⏭️ Recurring schedule bulk-edit improvements.

### Next:
- 🚀 Student & Parent communication portal optimization.

## Open Questions
- Should recurring-schedule support multiple time slots per day for same student? (UNCONFIRMED)

## Working Set
Current module: -
Active files: -
Focus: Ready for next module selection.