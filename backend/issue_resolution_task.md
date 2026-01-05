# API Debugging & Optimization Task List

- [ ] **Phase 1: Analysis**
    - [ ] Analyze `DocumentController` for 500 Error (Multipart handling).
    - [ ] Analyze `SessionRecordController` & `Repository` for Performance bottleneck.
- [ ] **Phase 2: Fix Implementation**
    - [ ] Refactor `POST /api/documents` to valid input and exception handling.
    - [ ] Optimize `GET /api/sessions`: Add Pagination (`Pageable`) or optimize Query (N+1, lazy loading).
- [ ] **Phase 3: Verification**
    - [ ] Run `api_security_tester.js` to verify 500 -> 400.
    - [ ] Measure `GET /api/sessions` response time (Target < 500ms).
