# API Security & Smoke Test Report

**Date**: 2026-01-05
**Environment**: Local (http://localhost:8080)
**Execution Tool**: `api_security_tester.js` (Node.js)

## Executive Summary
- **Total Endpoints Tested**: 24
- **Pass Rate**: 45% (11/24)
- **Critical Failures**: 1 (500 Internal Server Error on Upload)
- **Configuration Issues**: 12 (400/404/403 due to Missing Data/Role Mismatch)

## Detailed Findings

### ✅ Passed (stable)
-   **Auth**: Login (Authentication works correctly).
-   **Dashboard**: Stats API is responsive (~1.8s response time - WARNING: Slow).
-   **Courses**: List/Create courses functional.
-   **Schedule**: Generate Sessions successful.

### ❌ Failed (Needs Investigation)

| Endpoint | Status | Root Cause Analysis |
| :--- | :--- | :--- |
| `POST /api/documents` | **500** | Unhandled exception for missing file part in request. **Security Risk**: Information Disclosure (Stack trace). |
| `GET /api/student/*` | **400** | Admin user accessing Student endpoints. Current user has no linked Student profile. |
| `POST /api/exercises` | **400** | Validation Error. Payload `questions: []` might be invalid or missing required fields. |
| `GET /api/admin/courses/1` | **404** | Data Setup issue. Course ID 1 does not exist. |
| `POST /api/sessions` | **400** | Validation Error. Likely date format or overlapping schedule. |

## Recommendations
1.  **Fix 500 Error**: implementing proper `MultipartException` handling in `DocumentController`. Ensure it returns 400 Bad Request instead of 500.
2.  **Performance**: `Get All Sessions` took **6s** (`6053.77ms`). this is a critical bottleneck. Needs pagination or indexing.
3.  **Role Separation**: Create a separate `Student` user for testing student endpoints.
