# Calendar Management - Issues & Optimization

## Performance Issues
- [x] [P1-High] Calendar view initial load time
  - Root cause: Fetching all sessions for the month without pre-fetching
  - Status: FIXED with optimized caching and month pre-fetching in `useCalendarData`.

- [x] [P2-Medium] Optimize data fetching for calendar cells
  - Status: FIXED with transition away from redundant state and improved prop drilling.

## UX Issues
- [x] [P1-High] Drag & drop fails on consecutive moves (Optimistic Locking)
  - Symptom: "Dữ liệu đã bị thay đổi bởi người dùng khác" on 2nd drag.
  - Root cause: Frontend state (session version) not updating correctly after first move.
  - Status: FIXED.
    1. Forced `DraggableSession` remount on version change (`key={id-version}`).
    2. Updated `useDraggable` ID to include version (`id={session-id-version}`) to prevent ID collisions during `AnimatePresence` exit animations.

## Technical Debt (Optional)
- [x] Refactor long components in `features/calendar` to follow 50-line rule
  - Status: Completed refactor of `CalendarView` and `CalendarHeader`.

---

## Completed Work (Archive)
- [x] **[P1-High] Session editing layout scroll issue**: Fixed flexible container structure in `LessonDetailModal`.
- [x] **[P1-High] AI Feedback Generator UI usability**: Redesigned with glassmorphism and improved layout.
- [x] **[P2-Medium] AI Feedback selection feedback**: Enhanced badge styling and hover states.
