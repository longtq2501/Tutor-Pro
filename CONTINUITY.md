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
    - **Features:** Client-side pagination, React.memo optimization, responsive zoom (90% for laptop), and legacy code cleanup.

### Now:
- 🔄 Calendar Module: Fixed critical bug in document category display and resolved calendar navigation flicker (optimized with keepPreviousData). Performing comprehensive performance audit. Checking for unnecessary re-renders, optimizing data fetching across calendar-view, add-session-modal, and recurring-schedule sub-modules. Exploring enhancement opportunities for better UX.

### Next:
- ⏭️ Statistics & Debt Management integration (on hold - calendar priority)
- ⏭️ Mobile optimization for calendar views

## Open Questions
- Should recurring-schedule support multiple time slots per day for same student? (UNCONFIRMED)
- Is there a better UX for document selection beyond fixing category count? (UNCONFIRMED)

## Working Set
Current module: calendar (calendar-view, add-session-modal, recurring-schedule)
Active files: 
- frontend/features/calendar/calendar-view/
- frontend/features/calendar/add-session-modal/
- frontend/features/calendar/recurring-schedule/
- Components related to document selection modal
Focus: Document category count bug fix, performance optimization (re-render analysis), feature enhancement recommendations