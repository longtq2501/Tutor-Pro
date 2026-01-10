# Exercise Module - Issues & Progress

## Context
Module **Exercise** (Khảo thí) là hệ thống quản lý bài tập và kiểm tra đa năng, thay thế hoàn toàn module Homework cũ. Module này hỗ trợ tạo bài tập từ text, gán cho học sinh, chấm điểm tự động (MCQ) và thủ công (Essay).

## Metrics & KPIs
- **Transaction Success Rate**: Currently unknown (need monitoring)
- **Target**: 99.9% success rate for exercise operations

---

## Backend Issues


---

## Completed Work (Archive)
- [x] **[P0-Critical] Transaction Rollback Error** - FIXED ✅
  - **Root Cause**: Nested `@Transactional` methods - `NotificationListener` event handlers were called from `ExerciseServiceImpl.assignToStudent()`, both using default transaction propagation
  - **Solution**: Changed all 5 event listener methods to use `@Transactional(propagation = Propagation.REQUIRES_NEW)`
    - `handleExamSubmitted()`
    - `handleExamGraded()`
    - `handleExerciseAssigned()`
    - `handleExerciseUpdated()`
    - `handleScheduleCreated()`
  - **Impact**: Notification failures no longer cause exercise assignment rollback. Each notification runs in independent transaction.
  - **Files Modified**: `NotificationListener.java`
- [x] Removed Homework module (replaced by Exercise)
- [x] Integrated notification events for exercise assignment

---
