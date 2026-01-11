# Exercise Module - Issues & Optimization

## Performance Issues
*(None currently identified)*

## UX Issues
- [ ] [P1-High] **Category Persistence in Import Flow** (Issue #7)
    - **Problem:** When a category (e.g., "IELTS") is selected in Step 1 (Upload), it is not preserved in Step 2 (Preview), forcing re-selection.
    - **Solution:** Update `useImport` hook to persist `classId` and initialize `metadata.classId` in preview step.

- [ ] [P3-Low] **Category Synchronization Verification** (Issue #8)
    - **Question:** Confirm if categories created in Lesson module sync to Exercise module.
    - **Analysis:** Code uses shared `lessonCategoryApi.getAll()`, should be real-time. Need UI verification.

## UI Issues
- [ ] [P1-High] **Dark Mode Contrast in Exercise Creation** (Issue #6)
    - **Problem:** "Correct answer" Green text/bg is unreadable on dark backgrounds.
    - **Solution:** Add `dark:` variant overrides for `bg-green-50` and `text-green-800`.

## Technical Debt (Optional)
- [ ] Monitor Transaction Success Rate (Target: 99.9%)

---

## Completed Work (Archive)
- [x] [P1-High] **Detailed Student Progress View** (Issue #9)
    - **Solution:** Implemented groupings (Pending/Submitted/Graded) and circular progress UI.
- [x] [P1-High] **Indirect Navigation from Student Detail** (Issue #10)
    - **Solution:** Direct link to individual submission grading from Detail View.
- [x] [P1-High] **Filter Inactive Students from Dashboard** (Issue #4)
- [x] [P2-Medium] **Search and Category for Exercise Library** (Issue #5)
- [x] [P1-High] **Pagination for Admin Exercise List**
- [x] [P1-High] **"Pending" Status Tracking**
- [x] [P1-High] **UI Redesign for 1-1 Tutor Workflow**
- [x] [P0-Critical] **Transaction Rollback Error**
- [x] Removed Homework module (replaced by Exercise)
- [x] Integrated notification events for exercise assignment
