# API Fix & Optimization Plan (Refined)

## Goal
1.  **Security/Stability**: Fix 500 Internal Server Error when uploading documents. Ensure 415/400 is returned correctly.
2.  **Performance**: Optimize `GET /api/sessions` which currently takes >3s.

## Proposed Changes

### 1. Exception Handling (Completed)
**File**: `GlobalExceptionHandler.java`
-   Added handler for `MissingServletRequestPartException` (400 Bad Request).
-   Added handler for `HttpMediaTypeNotSupportedException` (415 Unsupported Media Type).

### 2. Test Script Refinement (Completed)
**File**: `api_security_tester.js`
-   Updated to skip `Content-Type: application/json` for `/api/documents` POST requests to correctly simulate multipart requests (or missing parts) without triggering 415.

### 3. Session Performance Optimization
**Investigation**: `GET /api/sessions` is still slow (~3s). `@BatchSize` was added but might not be fully effective if `findAll` loads everything into memory and converts to DTOs triggering lazy loading for thousands of records.
**Next Steps**:
-   **Review Repository**: Add `LEFT JOIN FETCH` for `student` (already present).
-   **Review Service**: The conversion to DTO accesses `record.getDocuments()` and `record.getLessons()`. Even with `@BatchSize`, fetching 3000 sessions means 60 extra queries (3000/50).
-   **Action**: Improve `SessionRecordRepository` to use `LEFT JOIN FETCH` for documents/lessons in the main query IF the number of records is small, OR implement **Pagination** as the only scalable fix.
-   **Decision**: Since the user wants "fix API", and 3s is borderline, I will add `LEFT JOIN FETCH` to the repository method for `documents` and `lessons` to fetch everything in **1 query**. This is risky for deduplication but with `Set` it should be fine.
    -   *Risk*: Cartesian Product. `Session` * `Documents` * `Lessons`.
    -   *Alternative*: Keep `@BatchSize` but ensure it's working.
    -   *New Strategy*: I will add `OpenSessionInView` check or ensure Transaction lies around the service. (It does).

## Verification Plan

### Automated Verification
1.  **Restart Backend**: User must restart backend.
2.  **Run Security Test**: `node api_security_tester.js`.
    -   Expect `POST Upload Document` -> **400** (Bad Request) or **415** (if body is truly empty). NOT 500.
    -   Expect `GET All Sessions` -> Monitor time.

### Manual Verification
-   Check logs for `HttpMediaTypeNotSupportedException` to disappear during test run.
