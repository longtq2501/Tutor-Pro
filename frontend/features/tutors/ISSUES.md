# Tutor Module - Implementation Tasks

## Goal
Implement complete Tutor CRUD module with multi-tenancy foundation.
Enable admin to manage tutors, view stats, and prepare for data isolation.

## P0 - Critical (Backend Foundation)

### Backend Tasks

- [x] **Create Tutor Entity** (backend\src\main\java\com\tutor_management\backend\modules\tutor\entity\Tutor.java)
  - Fields: id, userId, fullName, email, phone, subscriptionPlan, subscriptionStatus
  - Indexes: `@Index` on userId, email, subscriptionStatus
  - Relationships: OneToOne with User
  - Performance: Code-first indexes for fast lookups

- [x] **Create TutorRepository** (backend\src\main\java\com\tutor_management\backend\modules\tutor\repository\TutorRepository.java)
  - findByUserId(Long userId)
  - findByEmail(String email)
  - findAllWithPagination(Pageable pageable)
  - searchByNameOrEmail(String search, Pageable pageable)
  - countBySubscriptionStatus(String status)
  - Use `@EntityGraph` for user relationship

- [x] **Create TutorService** (backend\src\main\java\com\tutor_management\backend\modules\tutor\service\TutorService.java)
  - getAllTutors(page, size, search, status) → Paginated
  - getTutorById(id) → With stats (student count, session count, revenue)
  - createTutor(request) → Auto-create from user registration
  - updateTutor(id, request)
  - deleteTutor(id) → Cascade delete students/sessions
  - getTutorStats(id) → Join queries for counts
  - All read methods: `@Transactional(readOnly=true)`

- [x] **Create DTOs** (backend\src\main\java\com\tutor_management\backend\modules\tutor\dto)
  - TutorRequest (create/update) (backend\src\main\java\com\tutor_management\backend\modules\tutor\dto\request\TutorRequest.java)
  - TutorResponse (full details) (backend\src\main\java\com\tutor_management\backend\modules\tutor\dto\response\TutorResponse.java)
  - TutorSummaryProjection (list view - name, email, studentCount, status)
  - TutorStatsDTO (studentCount, sessionCount, revenue)

- [x] **Create TutorController** (backend\src\main\java\com\tutor_management\backend\modules\tutor\controller\TutorController.java)
  - GET /api/admin/tutors (paginated + filters)
  - GET /api/admin/tutors/{id}
  - GET /api/admin/tutors/{id}/stats
  - POST /api/admin/tutors
  - PUT /api/admin/tutors/{id}
  - DELETE /api/admin/tutors/{id}
  - @PreAuthorize("hasRole('ADMIN')")

### Performance Requirements
- Query time: < 50ms for list (with pagination)
- JOIN FETCH for user relationship
- DTO Projection for list view (avoid N+1)
- Composite index: (subscriptionStatus, email)

---

## P1 - High (Frontend Admin UI)

### Frontend Tasks

- [x] **Create tutor.ts service** (frontend\lib\services\tutor.ts)
  - API methods: getAll, getById, create, update, delete, getStats
  - TypeScript types: Tutor, TutorRequest, TutorStats
  - Pagination support

- [x] **Create Tutor Management Page** (frontend\features\tutors\index.tsx)
  - Table with columns: Name, Email, Students, Status, Actions
  - Search by name/email
  - Filter by subscription status
  - Pagination controls
  - Mobile responsive

- [x] **Create TutorTable component** (frontend\features\tutors\components\TutorTable.tsx)
  - Row actions: View, Edit, Delete
  - Status badge (ACTIVE/INACTIVE)
  - Student count display
  - < 50 lines

- [x] **Create TutorFormModal** (frontend\features\tutors\components\TutorFormModal.tsx)
  - Fields: fullName, email, phone, subscriptionPlan
  - Validation
  - Create/Edit modes
  - < 50 lines

- [x] **Create useTutors hook** (frontend\features\tutors\hooks\useTutors.ts)
  - React Query for data fetching
  - Search/filter state management
  - Pagination state

---

## P2 - Medium (Stats & Polish)

- [x] **TutorStatsCard** (frontend\features\tutors\components\TutorStatsCard.tsx)
  - Display: Total students, sessions, revenue
  - Charts: Revenue over time
  - Note: Integrated into `TutorFormModal` (Edit mode).

- [x] **Add tutors nav item** (frontend\app\dashboard\page.tsx)
  - Admin-only navigation
  - Icon: Users
  - Route: ?view=tutors

## UI Issues
- [x] [P2-Medium] Tutor table not mobile responsive (Fixed: Implemented Mobile Card View)
- [ ] [P3-Low] No empty state for zero tutors

- [x] [P1-High] **Tutor Stats Logic Not Implemented (Zero Data)**
  - Root cause: `TutorService.getTutorStats` returns hardcoded zeros (TODO left in code).
  - Solution: Implemented `countByTutorIdAndActiveTrue` (Students) and `sumSessionsByMonthAndTutorId` (Finance) in repositories. Used `getFinanceSummaryByTutorId` for revenue aggregation.

## UX & UI Improvements
- [x] [P2-Medium] **Tutor Stats Card UI Overflow**
  - Solution: Used `md:text-2xl` and `truncate` with tooltip. Added `maximumFractionDigits: 0` to formatter.

- [x] [P2-Medium] **Missing Read-Only "View Details" Mode**
  - Solution: Created `TutorDetailModal` for view-only experience. Clicking row now opens details. Edit moved to "Edit" button inside Detail modal or Action menu.

## Technical Debt
- [x] [P0-Critical] **createTutor does NOT create User account automatically**
  - Root cause: Current implementation requires userId to exist first
  - Target: Auto-create User + Tutor in single transaction
  - Metrics: Atomic operation, rollback on failure
  - **Backend changes:**
    - TutorRequest: Add `accountEmail`, `accountPassword` fields
    - TutorService.createTutor(): 
      1. Create User (role=TUTOR, email, password, fullName)
      2. Create Tutor (link to new User)
      3. Use @Transactional to ensure atomicity
    - Validation: Check email uniqueness in BOTH users and tutors tables
  - **Frontend changes:**
    - TutorFormModal: Add fields:
      - Account Email (for login)
      - Account Password (hashed)
      - Full Name (display name)
    - Validation: Email format, password strength (min 8 chars)
    - Note: Remove userId field (auto-generated now)

- [ ] Add cascade delete rules (tutor deleted → students/sessions?)
- [ ] Add subscription expiry tracking (cron job for expired subscriptions)

## Performance Issues
- [x] [P0-Critical] No data isolation by tutor_id (FIXED - Database)
- [x] [P0-CRITICAL] **Frontend NOT filtering students by current tutor**
  - Root cause: StudentService.getAllStudents() returns all students without tutor filter
  - Current behavior: New tutor (id=3) sees students of tutor (id=2)
  - Expected: Each tutor only sees THEIR students
  - Target: Add tutor_id filter in backend service
  - **Backend changes:**
    - StudentService: Get current tutor from auth context
    - Filter: WHERE tutor_id = currentTutorId
    - Admin exception: If role=ADMIN, show all students
  - **Frontend changes:**
    - No changes needed (backend filters automatically)
  - Metrics: Query time < 50ms with index

  - Metrics: Query time < 50ms with index

## Data Isolation & Security (Tutor Multi-tenancy)
- [x] [P0-CRITICAL] **Session Records NOT filtered by current tutor**
  - Root cause: `SessionRecordService.getAllRecords`, `getRecordsByMonth`, `getAllUnpaidSessions` return global data.
  - Critical Violation: `deleteSessionsByMonth` deletes ALL sessions in the system for that month.
  - Target: Inject `TutorRepository`, implement `getCurrentTutorId()`, filter all queries.
  - **Backend changes:**
    - `SessionRecordRepository`: Add `findByTutorId`, `deleteByTutorIdAndMonth`.
    - `SessionRecordService`: Enforce isolation in all read/write methods.

- [x] [P0-CRITICAL] **Constraint Violation in Automatic Schedule Generation**
  - Error: `Column 'tutor_id' cannot be null` during insert.
  - Root cause: `RecurringScheduleService.createSessionRecord` does not set `tutorId` in the builder.
  - `Fix`: Set `tutorId` from the student entity (which has `tutorId`).

- [x] [P0-CRITICAL] **Recurring Schedules NOT filtered by current tutor**
  - Root cause: `RecurringScheduleService` uses global queries (`findAllByOrderByCreatedAtDesc`).
  - Target: Apply data isolation similar to Student/Session modules.

- [x] [P0-CRITICAL] **Exercises NOT filtered by current tutor**
  - Root cause: `ExerciseService.listExercises` returns exercises from all tutors (no owner filter).
  - Target: Filter by `createdBy` (teacherId).
  - **Backend changes:**
    - `ExerciseRepository`: Update `findByFiltersOptimized` to accept `teacherId`.
    - `ExerciseService`: Pass `getCurrentTeacherId()` to repository.

- [x] [P1-High] **Data Isolation for Dashboard Stats**
  - Root cause: `DashboardService` sums global data.
  - Target: Parameterize stats queries with `tutorId`.
  - **Backend changes:**
    - `StudentRepository`: Add `countByCreatedAtBetweenAndTutorId`.
    - `DashboardService`:
      - Inject auth/tutor repos.
      - Add `getCurrentUserId` for cache key differentiation.
      - Update `getDashboardStats`: Check role, use filtered queries if Tutor.
      - Update `getMonthlyStats`: Check role, use filtered queries if Tutor.
      - Update cache keys to include user ID.

- [x] [P1-High] **Data Isolation for Exam Student List (Khảo thí > Theo học sinh)**
  - Root cause: `/api/tutor/dashboard/students` (invoked by `useTutorStudentSummaries`) returns global student data.
  - Solution: Implemented `tutorId` filter in `ExerciseService` and `StudentRepository`.
  - Refactor: Split `TutorStudentGrid` into sub-components (`TutorStudentCard`, `TutorStudentGridSkeleton`, `TutorStudentGridEmptyState`).

- [x] [P1-High] **Stale Data Persists After Logout (Caching Issue)**
  - Solution: Injected `useQueryClient` into `AuthContext` and called `queryClient.clear()` in the `logout` function. This wipes the entire cache on logout.

---

## Performance Targets
- List API: < 100ms
- Stats API: < 200ms (with joins)
- UI render: < 500ms
- Pagination: Smooth (no jank)