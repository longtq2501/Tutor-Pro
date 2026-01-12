# Exercise Module - Issues & Optimization

## UX Issues
- [ ] [P2-Medium] Search/Filter Persistence
  - Root cause: Library filters (category, search) are lost on refresh.
  - Target: Sync with URL query parameters.

## Completed Work

### Performance & Scalability
- [x] **Pagination for Assigned Exercises**: Implemented `Pageable` in `ExerciseController` and `ExerciseService`.
- [x] **Pagination for Tutor Dashboard**: Student summaries are now paginated to ensure dashboard performance on large datasets.
- [x] **Batch Student Counting**: Optimized student performance aggregation using batch IDs to avoid N+1 queries.

### UX Improvements
- [x] **Overdue Status Tracking**: Introduced "OVERDUE" virtual status by comparing deadlines with current time for pending assignments.
- [x] **Responsive Pagination**: Added pagination controls to both library table and tutor student grid.

### Clean Code & Documentation
- [x] **Modular Component Architecture**: Refactored `ExerciseList.tsx` (>450 lines) into `ExerciseTable`, `ExerciseMobileCard`, `ExerciseFilterBar`, and `AssignExerciseDialog`.
- [x] **Logic Separation**: Extracted complex state management into `useExerciseListLogic` custom hook.
- [x] **Documentation**: Added comprehensive Javadoc to `ExerciseService` and updated JSDoc for frontend components.
- [x] **Type Safety**: Eliminated `any` types in new exercise components and hooks.
