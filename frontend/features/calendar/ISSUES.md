# Calendar Module - Issues & Optimization

## 🎯 Current Status

**Module Optimization & Refactoring Completed!** The Calendar module has been modernized with:
- ✅ **Performance:** Optimized re-renders via `useCallback` and `memo`. Ultra-fast 0.2s duration-based animations.
- ✅ **Reliability:** Fixed critical data persistence bugs in feedback and document counting.
- ✅ **UI/UX:** Improved mobile responsiveness, aligned skeletons, and added drag-and-drop rescheduling.
- ✅ **Infrastructure:** Solidified React Query caching and API fetch limits.

---

## 📋 Active Items

- [ ] **No active items.** All reported issues have been resolved.

---

## 📦 Archive: Completed Work

### 🛡️ Bug Fixes (Resolved)
- [x] [P0-Critical] **Document category count mismatch**
  - **Issue:** Fetching only 100 docs caused incorrect counts in selection modal.
  - **Fix:** Increased fetch limit to 2000 in `useLessonDetailModal.ts`.
- [x] [P0-Critical] **Session comment/review not persisting**
  - **Issue:** Feedback ID cross-session leaking.
  - **Fix:** Explicitly reset `existingFeedbackId` and form state in `SmartFeedbackForm.tsx`.
- [x] [P1-High] **Incorrect Vietnamese category names**
  - **Fix:** Prioritized `categoryDisplayName` in Enum mapping.
- [x] [P1-High] **LazyInitializationException in Feedback API**
  - **Fix:** Added `@Transactional` and `@EntityGraph` to backend services.

### ⚡ Performance & Optimization
- [x] [P1-High] **Unnecessary Re-renders**
  - **Action:** Memoized all handlers in `useCalendarView` and stabilized `CalendarGrid` props.
- [x] [P1-High] **API Fetch Optimization**
  - **Action:** Added 5-minute `staleTime` and implemented `keepPreviousData` for fluid navigation.
- [x] [P1-High] **Optimized Modal Animation Speed**
  - **Action:** Switched from sluggish spring to 0.2s ease-out transitions. Removed conflicting CSS transitions.

### 🎨 UI/UX Improvements
- [x] [P3-Low] **Drag-and-Drop Rescheduling**
  - **Action:** Integrated `@dnd-kit` with premium visual feedback and optimistic updates.
- [x] [P2-Medium] **Aligned Calendar Skeleton**
  - **Issue:** Skeleton was stretched and misaligned.
  - **Fix:** Unified layout classes (padding, rounded-corners) between `CalendarSkeleton` and `CalendarGrid`.
- [x] [P2-Medium] **Mobile Responsiveness Overhaul**
  - **Action:** Grid-based stacking for modals, flexible height, and compact mobile indicators.
- [x] [P2-Medium] **Chronological Session Sorting**
  - **Fix:** Implemented ascending sort by date and startTime in `ListView` and `MonthView`.
- [x] [P1-High] **Feedback Header Overlap**
  - **Fix:** Responsive stackable header for `SmartFeedbackForm`.
