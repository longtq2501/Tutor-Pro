# Dashboard Module Issues

This document tracks problems, UX/UI improvements, and feature requests for the Dashboard module.

## 🚀 Active Issues

| ID | Issue | Category | Priority | Impact |
|:---|:---|:---|:---|:---|
| - | No active issues (P0 Resolved) | - | - | - |
| - | No active issues (P0 Resolved) | - | - | - |

---

## ✅ Archive (Completed)

| ID | Issue | Category | Priority | Status |
|:---|:---|:---|:---|:---|
| **P0** | **Wrong Active Student Count** | Data Integrity | P0 | Fixed |
| **P1** | **Time Filter Incorrect** | Functional | P1 | Fixed |
| **P0** | Revenue detail button points to wrong month in Finance | UX / Functional | P0 | Fixed |
| **P1** | Sidebar active state lost when navigating to Finance details | UI / UX | P1 | Fixed |
| **P3** | Missing Revenue Growth Line Chart | UI / UX | P3 | Implemented |
| **P3** | Missing Dashboard PDF Export | UX / Feature | P3 | Implemented |
| **P4** | Missing "New Students this month" metric | UI | P4 | Implemented |

### Archive Details

#### 6. (P0) Wrong Active Student Count
- **Fixed**: Backend logic updated in `StudentRepository` (`countByActiveTrue`) and `DashboardService`.
- **Result**: "Tổng Học Sinh" now strictly counts only students with `active = true` status, properly excluding dropped students.
- **Verification**: Verified via Unit Test `DashboardServiceTest`.

#### 7. (P1) Time Filter Incorrect
- **Fixed**: Removed hardcoded `.slice(0, 6)` in `useMonthlyChartData.ts`.
- **Result**: "1 Năm" filter now correctly displays up to 12 months of data on the Revenue Chart.
- **Verification**: Verified code logic in `EnhancedRevenueChart`.

#### 1. (P0) Revenue Detail Navigation Bug
- **Fixed**: Updated `FinanceContext.tsx` to read the `month` parameter from the URL during initialization.
- **Result**: "Xem chi tiết" now correctly filters the finance view by the selected month.

#### 2. (P1) Sidebar Active State Logic
- **Fixed**: Modified `Sidebar.tsx` and `DashboardPage.tsx` to properly map sub-views (`monthly`) to their parent navigation items.
- **Result**: Sidebar correctly highlights "Tài Chính" even when deep-linked into monthly details.

#### 3. (P3) Revenue Line Chart
- **Fixed**: Implemented `EnhancedRevenueChart` with both List and Chart views using Recharts.
- **Result**: Professional visual trend analysis for the last 6 months.

#### 4. (P3) Dashboard PDF Export
- **Fixed**: Moved PDF generation to Backend using iText for professional layout and Vietnamese support.
- **Result**: High-quality, compact PDF reports (4-column layout).

#### 5. (P4) New Students Tracking
- **Fixed**: Updated Backend `DashboardStats` to calculate new students and updated Frontend `StatCard`.
- **Result**: Real-time growth metrics in the main header.
