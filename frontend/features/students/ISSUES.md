# Student Module - Issues & Optimization

- [x] [P0-Critical] High Backend RAM Usage
  - Solution: Implemented pagination and lightweight summary DTOs to reduce object instantiation.
- [x] [P0-Critical] Missing Pagination in Student List
  - Solution: Integrated `Pageable` on the backend and updated frontend services/hooks to handle `PageResponse`.
- [x] [P1-High] Over-fetching in List API
  - Solution: Created `StudentSummaryResponse` containing only essential fields for the student list view.

## UX Issues
- [ ] [P2-Medium] **Header Title Improvement (Student View)**
  - **Issue**: "Header show title chưa tốt, nhiều view chưa và để trống."
  - **Target**: Review all Student Portal headers and ensure consistent, meaningful titles.
- [x] [P1-High] Missing Skeleton Loaders
  - Solution: Implemented `StudentCardSkeleton` and integrated it into `student-list/index.tsx`.
- [ ] [P1-High] Missing Search/Filter Persistence
  - Root cause: Search and filters are lost on page refresh.
  - Target: Sync filters with URL query parameters.

## UI Issues
- [x] [P2-Medium] iPhone SE Content Spacing
  - Solution: Reduced internal padding and avatar size on mobile.
- [ ] [P2-Medium] iPhone 16 Pro Max Responsive Check
  - Root cause: Potential grid layout issues on very wide or specific mobile viewports.
  - Target: Ensure zero overflow and proper alignment.

- [x] [P2-Medium] Long Component Functions
  - Solution: Refactored `StudentList`, `StudentCard`, and `AddSessionModal` into modular sub-components and hooks, all now comply with < 50 line rule.
- [x] [P2-Medium] Missing JSDoc/Javadoc
  - Solution: Added comprehensive documentation to all new backend methods and frontend components.
- [ ] [P2-Medium] Missing Automated Tests
  - Root cause: Logic in `StudentService` and hooks lack unit tests.

---

## Completed Work (Archive)
- [x] [P0-Critical] Implemented Backend Pagination (Spring Data Pageable)
- [x] [P1-High] Created lightweight `StudentSummaryResponse` DTO
- [x] [P2-Medium] Refactored `StudentList` & `StudentCard` (< 50 lines)
- [x] [P2-Medium] Optimized "Total Unpaid" query using Projection
- [x] [P1-High] Generic Spinner Loading State -> Skeleton
- [x] [P2-Medium] StudentModal length (Refactored to ~45 lines)
