# Student Module - Issues & Optimization

## UX Issues
- [x] [P1-High] Missing Skeleton Loaders
  - Solution: Implemented `StudentCardSkeleton` and integrated it into `student-list/index.tsx`.
  - Impact: Improved loading UX, reduced "jumpy" feeling.
- [x] [P2-Medium] Modal Body Scroll Lock
  - Solution: Replaced manual DOM manipulation with a reusable `useScrollLock` hook in `frontend/lib/hooks`.

## UI Issues
- [x] [P2-Medium] iPhone SE Content Spacing
  - Solution: Reduced internal padding (`p-4`) and avatar size (`w-14`) on mobile. Tightened gaps in button grid.

## Technical Debt (Optional)
- [x] [P2-Medium] StudentModal length (Refactored to ~45 lines)
  - Solution: Extracted `StudentFormFields`, `StartMonthField`, and `NotesField`.
  - Violates: GEMINI.md (target < 50 lines) - Fixed.

---

## Completed Work (Archive)
- [x] [P0-Critical] Initialized ISSUES.md
- [x] [P1-High] Header Action Layout Refactor (from CONTINUITY)
- [x] [P2-Medium] Mobile Stats Layout Optimization (from CONTINUITY)
- [x] [P2-Medium] Fixed Width Inconsistency (from CONTINUITY)
- [x] [P1-High] Generic Spinner Loading State
  - Solution: Replaced with `StudentCardSkeleton` layout.
  - Tested: ✅
- [x] [P1-High] Missing Skeleton Loaders
  - Solution: Created precise skeleton components matching final cards.
  - Tested: ✅
- [x] [P1-High] Sidebar Responsive Layout Breakage (from CONTINUITY)
