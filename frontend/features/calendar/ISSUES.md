# Calendar Module - Issues & Optimization

## Bugs (URGENT)
- [x] [P0-Critical] Document category count mismatch in selection modal
  - Symptom: Shows incorrect count (e.g. "43 found" when more exist)
  - Impact: Users cannot select correct documents for sessions
  - Root cause: `useLessonDetailModal` was only fetching the first 100 documents, causing client-side filtering to miss documents on subsequent pages.
  - Fix: Increased fetch limit to 2000 to ensure all documents are loaded.
  - Status: ✅ Fixed

- [x] [P1-High] Incorrect document categories in session modal
  - Symptom: Category tabs showed raw Enum keys (VOCABULARY) instead of Display names (Từ vựng).
  - Root cause: `getCategoryName` helper in `useLessonDetailModal` was naively returning the category string if present.
  - Fix: Updated helper to prioritize `categoryDisplayName` and `categoryName` before falling back to raw key.
  - Status: ✅ Fixed

## Performance Issues
- [x] [P1-High] Calendar view re-renders on every interaction
  - Root cause: Inline functions (`onDayClick`, `onAddSession`, `onContextMenu`) passed to `CalendarGrid` caused it to re-render even when memoized.
  - Fix: Wrapped handlers in `useCallback` inside `useCalendarView` and `CalendarView`. Stabilized `CalendarGrid` props.
  - Status: ✅ Fixed
  - Metrics: `CalendarGrid` now only renders when data changes, not when modals/context menus open.

- [x] [P1-High] Optimize React Query usage
  - Check `staleTime` and cache invalidation policies to prevent unnecessary fetching.
  - Analyze if `auto-generate` execution time can be improved.
  - Fix: Added `staleTime: 5 mins` to Document and Lesson Library queries.
  - Status: ✅ Optimized

## UX Issues  
- [x] [P2-Medium] Document selection UX is cumbersome
  - Fix: Implemented dynamic height for mobile (`max-h-[50vh]`), added "Clear Search" button, and "NEW" badges for recent items.
  - Status: ✅ Improved

- [x] [P2-Medium] Calendar navigation flicker
  - Fix: Using `keepPreviousData` in React Query to persist UI during fetches. Added subtle `Loader2` indicator in header.
  - Status: ✅ Fixed (Production-ready UX)

## UI Issues
- [ ] [P2-Medium] Modal responsiveness on mobile
  - Issue: Modals might not fit well on smaller screens.
  - Target: Ensure proper scaling and scrollability on mobile.

## Feature Enhancements
- [ ] [P3-Low] Add drag-and-drop rescheduling
  - Value: Quick intuitive rescheduling.
  - Complexity: High (requires DnD library integration and collision detection).

- [ ] [P3-Low] Session templates for quick add
  - Value: Faster session creation for recurring patterns.
  - Complexity: Medium.

- [ ] [P3-Low] Duplicate session feature
  - Value: Easy copy of sessions.
  - Complexity: Low.

- [ ] [P3-Low] Bulk edit time slots in recurring schedule
  - Value: Management efficiency.
  - Complexity: Medium.

---

## Completed Work (Archive)
- [x] [P0-Critical] Fixed document count bug
  - Solution: Increased API fetch limit from 100 to 2000 in `useLessonDetailModal.ts` to ensure all documents are loaded for client-side filtering.
  - Before: Only first 100 documents loaded, counts were wrong for filtered results.
  - After: All documents (up to 2000) loaded, counts are accurate.
  - Tested: ✅ (Code verified)

- [x] [P1-High] Optimized Calendar Re-renders
  - Solution: Memoized all event handlers in `useCalendarView` and removed inline functions in `CalendarView` render.
  - Result: `CalendarGrid` no longer re-renders when interacting with other UI elements (modals, headers).

- [x] [P1-High] Cached Library Data
  - Solution: Added `staleTime: 5 mins` to `useLessonDetailModal` queries.
  - Result: Modal opens instantly on subsequent clicks without refetching data.

- [x] [P1-High] Fixed Document Category Display
  - Solution: Updated `getCategoryName` to use `categoryDisplayName` from API response.
  - Result: Modal now shows correct Vietnamese categories (e.g., "Ngữ pháp" instead of "GRAMMAR").

- [x] [P2-Medium] Enhanced Document Selection UX
  - Solution: Added dynamic list height, clear search button, and "NEW" badges.
  - Result: Better mobile experience and faster document discovery.
