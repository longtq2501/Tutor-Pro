## Performance Issues
- [ ] [P0-Critical] No pagination - backend returns ALL documents in category (will slow down as data grows)
- [ ] Missing search functionality - users must scroll through all documents

## UX Issues  
- [ ] [P1-High] Categories are hardcoded - cannot add/edit categories from UI
- [ ] No visual feedback when loading documents
- [ ] Search/filter capability needed for better document discovery

## Phase 1: Quick Wins (UI & Responsive) - ✅ DONE

### UI Issues
- [x] [P0-Critical] Fix DocumentPreviewModal responsive
  - [x] Removed rigid width/height constraints
  - [x] Used `dvh` (100dvh) for mobile and `w-screen`
  - [x] Added responsive breakpoints: `md:w-[90vw]`, `md:max-w-7xl`
  - [x] PDF viewer scales correctly via iframe wrapper
  - Tested: ✅ Desktop → Mobile resize works
  - Tested: ✅ Mobile → Desktop resize works

## Phase 2: Core Refactor (Backend) - ✅ DONE

### Backend Issues
- [x] [P1-High] Hardcoded Categories Refactor
  - [x] Renamed `DocumentCategory` Enum to `DocumentCategoryType` (Legacy support)
  - [x] Created `DocumentCategory` Entity (Dynamic support)
  - [x] Created `DocumentCategoryService` & `Controller` (`GET /api/document-categories`)
  - [x] Added `DataInitializer` to seed DB from Enum options
- [x] [P0-Critical] Pagination Implementation
  - [x] Updated `DocumentController` to return `Page<DocumentResponse>`
  - [x] Updated `DocumentService` to support `Pageable`
  - [x] Optimized Repository queries with `LEFT JOIN FETCH`
  - Warning: API breaking change (List -> Page) - Frontend needs Phase 3 fix immediately.

## Phase 3: Frontend Integration - ✅ DONE

### Frontend Issues
- [x] [P0-Critical] App Breakage due to API Change
  - [x] Updated `services/document.ts` to handle `PageResponse<T>`
  - [x] Created `useDocuments` hook for pagination
  - [x] Created `useCategories` hook for dynamic categories
- [x] [P1-High] Dynamic Category Integration
  - [x] Updated `CategoryGrid` to render categories from API (`categories` prop)
  - [x] Updated `CategoryView` to take pagination props
- [x] [P1-High] Pagination UI
  - [x] Added `page`, `setPage`, `totalPages` state to `useDocumentLibrary`
  - [x] Added Pagination Controls (Prev/Next) to `CategoryView`
- [x] [P0-Critical] Responsive Preview Content
  - [x] Reverted Modal Container to `w-full h-full` (User preference)
  - [x] Added `view=FitH` to PDF Preview iframe to force responsive scaling
  - [x] Verified `DocumentInfo` mobile padding

## Phase 4: Polish & User Feedback - (Pending)

### User Reported Issues
- [x] [P1-High] **Category Counts Mismatch:** Total documents (43) is correct, but individual category cards show "0 items".
  - Refactored `DocumentService` to calculate stats map dynamically
  - Updated `DocumentStats` DTO to `Map<String, Long>`
- [x] [P2-Medium] **Category Management:** User cannot delete unwanted categories. Feature is missing.
  - Added `DELETE /api/document-categories/{id}` endpoint
  - Added Delete Button (Trash Icon) to `CategoryGrid`
- [x] [P2-Medium] **Animation Polish:** Page transitions are abrupt on entry (stiff) but smooth on exit. Needs consistent smooth fade-in/out.
  - Implemented `AnimatePresence mode="wait"` with container keying for smooth page transitions
- [x] [P3-Low] **Preview Modal Sizing:** Desktop view is too large. User prefers a smaller, centered view.
  - Adjusted to `md:max-w-5xl md:h-[85vh]` for a cleaner, contained look.
- [x] [P3-Low] **Mobile Typography:** Font sizes are too large on mobile, causing wrapping.
  - Reduced `StatsCards` font sizes (`text-xl` -> `text-lg`, `text-xs` -> `text-[10px]`).
  - Reduced `CategoryGrid` font sizes (`text-base` -> `text-sm`).
- [x] [P3-Low] **Custom Scrollbar:** Default scrollbar in PDF Preview looks native.
  - Applied `scrollbar=0` to PDF iframe to attempt hiding native bars.
  - Confirmed `globals.css` has custom scrollbar styles for app containers.
- [x] [P3-Low] **Mobile Header Polish:** Modal Header layout looks squeezed/ugly on mobile.
  - Refactored `ModalHeader` to `flex-row` (single line) on mobile.
  - Reduced padding, icon size, and text size for a cleaner look.
- [x] [P2-Medium] **Category Deletion UX:**
  - [x] Replace `window.location.reload()` with Query Invalidation for smooth update.
  - [x] Replace native `confirm()` with custom `ConfirmDialog` component.
- [x] [P2-Medium] **Category CRUD & Animations:**
  - [x] Backend: Create/Update API (`POST`, `PUT`).
  - [x] Frontend: `CategoryFormModal` (Add/Edit).
  - [x] UI: "Add Category" Button + Edit Icon.
  - [x] Animation: Smooth entry/exit using `framer-motion` (Spring).
  - [x] UX: `toast.promise` for loading state.
  - [x] Fix: `CategoryFormModal` Type Mismatch (Category vs DocumentCategory).
  - [x] Fix: `DocumentUploadModal` uses Dynamic Categories (removed hardcoded list).
  - [x] Fix: Stale data flash when switching categories (optimized `placeholderData`).
  - [x] Fix: Import errors in `document.ts` service.
  - [x] Fix: Stale data flash when switching categories (optimized `placeholderData`).
  - [x] Fix: Import errors in `document.ts` service.
  - [x] UX: Replace Loading Spinner with Skeleton (Performance perceived improvement).
  - [x] Backend: Fixed N+1 Query in `DocumentRepository` (Added `JOIN FETCH category`).
  - [x] Backend: Optimized `getStatistics` API (Reduced N+3 queries to 2 aggregated queries).
  - [x] Backend: Implemented Caching for `getStatistics` (Instant response < 100ms).

## Validated State
- **Backend:** Dynamic Categories (Entity), Pagination (Page<T>)
- **Frontend:** Pagination UI, Dynamic Tabs, Responsive Preview
- **Architecture:** Scalable for large datasets
```
