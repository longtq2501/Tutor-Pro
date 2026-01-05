# API Fix & Optimization Plan

## Goal
1.  **Security/Stability**: Fix 500 Internal Server Error when uploading documents without a file. Return 400 Bad Request instead.
2.  **Performance**: Optimize `GET /api/sessions` which currently takes >6s due to loading all records and potential N+1 query issues.

## User Review Required
> [!IMPORTANT]
> **API Change**: `GET /api/sessions` will now support (and default to) pagination.
> New signature: `GET /api/sessions?page=0&size=20`
> Clients relying on receiving *every single record in one call* might need to be updated to handle pagination or request a larger size (max limits may apply).

## Proposed Changes

### 1. Document Upload Error (500 -> 400)
**File**: `DocumentController.java` (or Global Handler)
-   Add Exception Handler for `org.springframework.web.multipart.support.MissingServletRequestPartException`.
-   Return `ResponseEntity.badRequest().body(...)`.

### 2. Session Performance (6s -> <500ms)
**Files**: `SessionRecordController.java`, `SessionRecordService.java`, `SessionRecordRepository.java`

#### `SessionRecordRepository.java`
-   [MODIFY] Change `findAllByOrderByCreatedAtDesc` to accept `Pageable`.
-   [NEW] `findAll(Pageable pageable)` with optimized EntityGraph/Join fetching.
-   **N+1 Fix**: Ensure `student` is fetched (already is). Use Batch Fetching or Hibernate settings to handle `documents` and `lessons` lazy loading batches, OR avoid mapping them in the list view if not needed.
    -   *Decision*: I will implement Pagination.

#### `SessionRecordService.java`
-   [MODIFY] `getAllRecords()` -> `getAllRecords(Pageable pageable)`.
-   [MODIFY] Return `Page<SessionRecordResponse>` or `PagedResponse`.

#### `SessionRecordController.java`
-   [MODIFY] `getAllRecords` endpoint to accept `page` and `size` parameters.

## Verification Plan

### Automated Verification
1.  **Security Test**: Run `node api_security_tester.js`.
    -   Expect `POST /api/documents` (Empty Body) -> **400 Bad Request** (was 500).
2.  **Performance Test**:
    -   Run curl/Postman to `GET /api/sessions?size=20`.
    -   Expect response time **< 500ms**.

### Manual Verification
-   Upload a file normally to ensure functionality is not broken.
-   Check "All Sessions" list in UI (Frontend might need update if it expects a List array, but for backend SDET task I will ensure API is performant. If Frontend breaks, I will note it or make a minimal fix if requested, but user asked to "fix API").
    -   *Correction*: User said "Làm luôn đi, đảm bảo work 100%". This implies full system integrity. If I change API response format (List -> Page), Frontend **WILL** break.
    -   **Constraint**: I must maintain the `List<SessionRecordResponse>` signature for the default endpoint OR update the Frontend.
    -   *Better Approach for "Work 100%"*:
        -   Keep `GET /api/sessions` returning `List` but enforce a **soft limit** (e.g., last 100) OR optimize the data fetching so retrieving all is fast (e.g., removing nested `documents`/`lessons` from the list view DTO).
        -   **Proposed Strategy**: Add `@BatchSize(size = 50)` annotations to `SessionRecord`'s `documents` and `lessons` collections. This fixes N+1 without breaking API signature.
        -   ALSO add a NEW paginated endpoint `GET /api/sessions/paged` for future use, OR just fix the N+1.
        -   Given "6s" delay, it's likely N+1. 100 records * 2 queries = 200 queries.
        -   I will verify N+1 hypothesis by adding Hibernate SQL logging if needed, but `@BatchSize` is a safe, low-risk optimization.

**Revised Plan for Session**:
1.  **Entity Optimization**: Add `@BatchSize` to `SessionRecord` relations.
2.  **Repository Optimization**: Check if `findAll` is truly fetching everything.
3.  **Controller**: Keep signature for now to avoid breaking Frontend, but if list is massive (thousands), we MUST paginate. I will check the frontend code (`useCalendarView.ts` or similar) to see how it consumes it.

## Updated Verification
-   Run `api_security_tester.js`.
