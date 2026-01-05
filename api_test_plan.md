# API Security & Load Testing Plan

## 1. Schema Parsing & Analysis
**Source**: `Tutor_Management_Postman_Collection.json`
**Base URL**: `http://localhost:8080`

### Resource Dependency Graph
1.  **Auth**: Independent. Root of all access.
2.  **Student**: Independent (created by Admin) or Dependent (if self-registration).
3.  **Course**: Independent.
4.  **RecurringSchedule**: Dependent on `Student` and `Tutor`.
5.  **SessionRecord**: Dependent on `RecurringSchedule` or created manually linked to `Student`.
6.  **Homework**: Dependent on `Student`.
7.  **Submission**: Dependent on `Homework`/`Exercise` and `Student`.
8.  **Invoice**: Dependent on `Student` and `SessionRecord` (for calculation).

### Critical Endpoints (High Risk)
-   `POST /api/auth/login`: Brute force target.
-   `POST /api/documents` (Upload): Malicious file upload.
-   `POST /api/recurring-schedules/generate-sessions`: Logic bomb / DoS risk if `month` range is abusive.
-   `GET /api/invoices/download-pdf`: BOLA risk (downloading other's invoice).

## 2. Data Mocking Strategy

### Positive Data
-   **Emails**: `tutor@test.com`, `student+1@test.com`
-   **Dates**: ISO8601 `2025-01-01T00:00:00`
-   **IDs**: Existing Database IDs (need extraction step).

### Negative Data (Adversarial)
-   **SQL Injection**: `' OR '1'='1`, `1; DROP TABLE users;--`
-   **XSS**: `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`
-   **BOLA**: ID Shifting (Requesting `student/5` while logged in as `student/1`).
-   **Logic**:
    -   `month` = `9999-99` (Date parsing/Overflow)
    -   `amount` = `-100` (Business logic bypass)
    -   `file` = `malware.exe.pdf` (Double extension)

## 3. E2E Sequence (Golden Path)

1.  **Setup**: Admin logs in -> Gets Token.
2.  **Creation**: Create `Student A`. Create `Course Java`.
3.  **Assignment**: Assign `Student A` to `Course Java`.
4.  **Operation**: Create `RecurringSchedule` for `Student A`.
5.  **Trigger**: `generate-sessions` for `2025-01`.
6.  **Verification**: Get `SessionRecords` -> Verify count.
7.  **Billing**: Generate `Invoice` for `Student A`.
8.  **Teardown**: Delete `Student A` (Cleanup).

## 4. Execution Strategy
We will use a custom Python script (`api_security_tester.py`) to execute these checks.

### Modules:
1.  **CollectionLoader**: Parses Postman JSON.
2.  **AuthManager**: Handles login and header injection.
3.  **Fuzzer**: Mutates payloads based on "@Fuzz" annotations or type inference.
4.  **Reporter**: Outputs `security_report.html` or `json`.
