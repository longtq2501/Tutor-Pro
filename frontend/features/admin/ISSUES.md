# Admin Module Issues & Debt

## Status: COMPLETE (Ready for Review)

## Technical Debt
- **Pagination Sync**: Some tables use 1-based pagination on frontend but current API returns 0-based. Handled with mapping but could be standardized.
- **Loading UI**: Using basic text loading states. Replacement with Skeleton loaders from Shadcn/UI would improve UX (P3-Low).
- **Search Optimization**: Search currently triggers on every keystroke. Implementing a debounce (e.g., 300ms) would reduce backend load (P2-Medium).
- **Chart Data**: Revenue chart in Overview still uses some mock interpolation logic for missing months.

## Known Issues
- [ ] Profile menu in AdminTopNav: Needs connection to real user logout/profile endpoints.
- [ ] Statistics accuracy: Total Hours in Sessions History is a rough estimate (Total Sessions * 1.5).

## Quality Metrics
- [x] No `any` types in `features/admin`
- [x] `npm run build` passes
- [x] Responsive on iPhone SE
