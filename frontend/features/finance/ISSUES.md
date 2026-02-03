# Finance Module - Issues & Optimization

## Performance Issues
- [x] [P1-High] Segmented Loading States
  - Root cause: `FinanceHeader`, `FinanceStats`, and `FinanceContent` load independently or show partial skeletons.
  - Target: Unified view-level skeleton for "Full Page Persistence".
  - Metrics: Current load feels segmented.

## UX Issues
- [ ] [P2-Medium] **Scrollbar Flicker**
  - **Context**: Switching from "Theo tháng" to "Công nợ".
  - **Issue**: Scrollbar appears momentarily then vanishes.

## Feature Requests
- [ ] [P1-High] **Remove Student Finance View** (Student Portal)
  - **User Request**: "Bị thừa view này, hãy xóa nó đi khỏi giao diện của học sinh trong sidebar."
  - **Action**: Remove Finance route/link from Student Sidebar.
- [x] [P1-High] Unwanted Horizontal Scrollbar
  - Solution: Added `overflow-x-hidden` to `FinanceDashboard` and removed redundant `w-full` from sticky `FinanceHeader`.
- [x] [P1-High] Generic Dashboard Spinner
  - Review: Ensure it matches the compact `StudentFinanceCard` layout precisely.

## UI Issues
- [x] [P1-High] Unwanted Horizontal Scrollbar
  - Symptoms: Horizontal scrollbar appears at the bottom of the Finance module on desktop/large screens.
  - Potential Cause: Overflowing elements in `FinanceHeader` or `StudentFinanceCard` layout.
- [x] [P3-Low] Skeleton Consistency
  - Ensure skeletons use `bg-muted/40` and `animate-pulse` consistently across the app.

## Technical Debt (Optional)
- [x] Component Length Check
  - Solution: Refactored `FinanceHeader` and `FinanceStats` by extracting sub-components (`ViewModeToggle`, `MonthSelector`, `StatCard`). Both components are now < 50 lines.

---

## Completed Work (Archive)
- [x] [P0-Critical] Module Cleanup & Data Integrity (from CONTINUITY)
- [x] [P1-High] Mobile Responsiveness (from CONTINUITY)
