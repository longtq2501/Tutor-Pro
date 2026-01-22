# Live Teaching Feature - Issues & Optimization

## Performance Issues
- [ ] [P0-Critical] Whiteboard real-time sync lag/dropouts
  - Root cause: High-frequency updates during drawing overwhelm the WebSocket/State cycle. Reactive `useEffect` send logic may cause race conditions.
  - Symptoms: Strokes appear partially on other account, or lag behind significantly.
  - Target: Refactor to use a separate rendering layer or a more robust sync protocol (e.g., sending only point deltas instead of full strokes).
  - Metrics: Zero stroke dropouts, sync latency < 100ms.
- [ ] [P1-High] No TURN server for users behind restrictive firewalls
  - Root cause: P2P fails if both users behind NAT/firewall.
  - Target: Integrate free TURN server (Twilio STUN/TURN or self-hosted coturn).
  - Metrics: Connection success rate > 95% (currently ~70%).
  - Files: `backend/.../modules/onlinesession/service/TurnService.java`
- [ ] [P2-Medium] Routing logic mixes lobby and room in same component
  - Root cause: `/live-room` path renders different UIs based on state.
  - Target: Split into 2 routes: `/live-room` (lobby) and `/live-room/{roomId}` (room).
  - Metrics: Clean separation of concerns, easier to maintain.
  - Files: `frontend/features/live-room/index.tsx`, routing config

## UX Issues
- [ ] [P2-Medium] Missing participant presence UI
  - Root cause: No visual indicator of who is currently in the room (other than chat activity).
  - Target: Add a participants list or active counters to the header.
- [ ] [P2-Medium] Floating controls overlap content on small screens
  - Target: Make controls sticky to bottom, adjust z-index.
- [ ] [P2-Medium] Recording indicator not visible enough
  - Root cause: Small icon, easy to miss.
  - Target: Add pulsing 🔴 REC badge + prominent timer.
  - Metrics: Users always aware when recording active.
- [ ] [P3-Low] No pinch-to-zoom on whiteboard (mobile)
  - Target: Add gesture handlers for zoom/pan.

## UI Issues
- [ ] [P0-Critical] Live Room UI not full-width/responsive
  - Root cause: Container has fixed width or max-width constraint.
  - Target: Remove `max-w` constraints, ensure `w-full` and proper flex expansion.
  - Violation: GEMINI.md "Responsive Design" rule.

## Technical Debt (Optional)
- [ ] [P1-High] No integration tests for WebSocket
  - Target: Test join, heartbeat, signal, disconnect events.
  - Files: `backend/.../modules/onlinesession/RoomWebSocketHandlerTest.java`
- [ ] [P2-Medium] No integration test for conversion flow
  - Target: Write test: convert session → verify online_sessions created → verify notification sent.
  - Metrics: Full flow succeeds without errors.
- [ ] [P2-Medium] No E2E test for user journey
  - Target: Playwright/Cypress test: open calendar → convert session → open lobby → join room → draw/chat → end.
- [ ] [P2-Medium] No analytics tracking for recording feature usage
  - Target: Track `recording_started`, `recording_downloaded`, `recording_discarded` events.
  - Files: `frontend/lib/analytics.ts`
- [ ] [P2-Medium] No structured logging for debugging
  - Root cause: Console.log everywhere, no context.
  - Target: Add `logEvent(eventType, data)` helper, send to backend logging service.
- [ ] [P3-Low] No metrics/monitoring dashboard
  - Target: Add `/actuator/metrics` endpoints (`rooms.active`, `connections.success-rate`, `avg-session-duration`).
- [ ] [P3-Low] No recording stats on dashboard
  - Target: Show total recordings, duration, download rate on tutor dashboard.

---

## Completed Work (Archive)

### Foundation & Setup
- [x] [P0-Critical] Missing custom exception infrastructure
  - Solution: Created 4 custom exceptions (RoomNotFoundException, RoomAccessDeniedException, RoomAlreadyEndedException, InvalidTokenException).
- [x] [P0-Critical] Missing environment configuration
  - Solution: Added `app.online-session` properties to `application.yaml` and `.env.local`.
- [x] [P0-Critical] Missing database indexes on online_sessions table
  - Solution: Added `@Index` annotations for `room_id`, `room_status`, `tutor_id`, `student_id`, etc.
- [x] [P0-Critical] Missing DTO layer for API endpoints
  - Solution: Created 5 DTOs (`CreateOnlineSessionRequest`, `OnlineSessionResponse`, etc.).
- [x] [P0-Critical] Created complete architecture documentation
  - Solution: 18-page markdown with diagrams, flows, code examples.

### Security & Authorization
- [x] [P0-Critical] No authorization check for room access
  - Solution: Implemented `RoomAccessValidator` with role-based participation checks.
- [x] [P0-Critical] Missing JWT token generation service
  - Solution: Implemented `RoomTokenService.generateToken` using dedicated session secret.
- [x] [P0-Critical] Fix: Student "Access Denied" on room stats
  - Solution: Updated `@PreAuthorize` to allow any authorized participant.
- [x] [P0-Critical] Missing @PreAuthorize annotations on controller methods
  - Solution: Implemented detailed rules on all endpoints.

### WebSocket & Real-time
- [x] [P0-Critical] Missing WebSocket configuration
  - Solution: Configured STOMP broker and `/ws/room` endpoint.
- [x] [P0-Critical] No JWT validation on WebSocket connection
  - Solution: Added permission to `SecurityConfiguration`.
- [x] [P1-High] No heartbeat mechanism to detect disconnects
  - Solution: Implemented `useHeartbeat` hook and backend `PresenceService`.
- [x] [P2-Medium] WebSocket error messages not user-friendly
  - Solution: Implemented `WebSocketExceptionHandler` returning structured `ApiResponse`.
- [x] [P1-High] Whiteboard sync causes lag with fast drawing
  - Solution: Created `useWhiteboardSync` hook with 50ms throttle.
- [x] [P1-High] Whiteboard data not persisted on page refresh
  - Solution: Implemented `useWhiteboardPersistence` with `localStorage` auto-save.
- [x] [P0-Critical] Whiteboard synchronization broken (Initial)
  - Solution: Implemented broadcast mappings in WebSocket controller.

### Frontend Features & UX
- [x] [P0-Critical] Missing frontend API client service
  - Solution: Created `onlineSessionApi`.
- [x] [P0-Critical] Missing TypeScript types for API responses
  - Solution: Defined `OnlineSessionResponse`, `JoinRoomResponse`, etc.
- [x] [P1-High] No fallback UI when getUserMedia fails
  - Solution: Created `useMediaStream` hook and `MediaFallbackUI`.
- [x] [P1-High] No loading state during WebRTC connection
  - Solution: Implemented `WebRTCConnectionLoading` with 5-stage progress.
- [x] [P0-Critical] Feature: Proactive "Lobby" for session discovery
  - Solution: Implemented logic to fetch and display active sessions.
- [x] [P2-Medium] No visual indicator for mic/camera status
  - Solution: Implemented `MediaControls` & `MediaStatusOverlay`.
- [x] [P1-High] No error recovery UI
  - Solution: Implemented `ErrorRecoveryDialog` with retry and audio-only mode.
- [x] [P0-Critical] Missing centralized room state management
  - Solution: Implemented `RoomStateContext` with full TypeScript support.
- [x] [P1-High] No error boundary for room component
  - Solution: Implemented `RoomErrorBoundary` with fallback UI.
- [x] [P2-Medium] No undo/redo for whiteboard
  - Solution: Implemented history stacks and keyboard shortcuts.
- [x] [P2-Medium] No indication when other user is typing in chat
  - Solution: Implemented `useChatTyping` with WebSocket synchronization.
- [x] [P3-Low] No dark mode support for room interface
  - Solution: Integrated Shadcn semantic tokens for dark mode.
- [x] [P3-Low] No emoji support in chat
  - Solution: Added `emoji-picker-react` with lazy loading.

### Calendar & Lifecycle
- [x] [P0-Critical] No endpoint to convert session from Calendar to Online
  - Solution: Implemented `PATCH /sessions/{id}/convert-to-online`.
- [x] [P0-Critical] No API to fetch user's online sessions for lobby
  - Solution: Implemented `GET /api/online-sessions/my-sessions`.
- [x] [P0-Critical] Missing canJoinNow calculation in API response
  - Solution: Added `canJoinNow` field based on scheduled start - 15 minutes.
- [x] [P0-Critical] Calendar UI missing "Convert to Online" action
  - Solution: Added "🌐 CHUYỂN ONLINE" button with `useConvertToOnline` hook.
- [x] [P2-Medium] Missing "Convert to Offline" action
  - Solution: Implemented `revertToOffline` endpoint and button.
- [x] [P0-Critical] No Live Teaching Lobby component
  - Solution: Created `LiveTeachingLobby` and `SessionCard`.
- [x] [P0-Critical] Online sessions not auto-displayed after conversion
  - Solution: Refactored lobby to use React Query invalidation.
- [x] [P1-High] No notification sent when session converted to online
  - Solution: Implemented event handler in `NotificationListener`.
- [x] [P0-Critical] Session conversion not transactional
  - Solution: Wrapped `convertToOnline` in `@Transactional`.
- [x] [P1-High] No custom exceptions for conversion errors
  - Solution: Created `SessionAlreadyOnlineException` and `SessionCannotBeConvertedException`.
- [x] [P0-Critical] Billable time calculation incorrect
  - Solution: Implemented overlap calculation using `GREATEST`/`LEAST` logic in `endSession`.
- [x] [P0-Critical] No scheduled cleanup for inactive rooms
  - Solution: Implemented auto-end logic for inactive rooms (> 2 mins).
- [x] [P1-High] No visual timer for billable time
  - Solution: Implemented `useBillableTimer` and `BillableTimer` component.
- [x] [P1-High] No warning before auto-end due to inactivity
  - Solution: Implemented real-time WebSocket warning broadcasts.

### Recording Module
- [x] [P1-High] Recording consumes too much RAM for long sessions
  - Solution: Chunks stored as Blobs, 2-hour hard limit with auto-stop.
- [x] [P1-High] Browser compatibility not checked before recording
  - Solution: Added `browserCompat.ts` detection.
- [x] [P1-High] No warning before hitting 2-hour recording limit
  - Solution: Added alerts at 1h 45m and 1h 55m.
- [x] [P1-High] Recording lost if user closes tab accidentally
  - Solution: implemented `onbeforeunload` listener.
- [x] [P2-Medium] No preview before downloading recording
  - Solution: Implemented `RecordingPreviewDialog` with verification step.
- [x] [P1-High] No cleanup of blob URLs after download
  - Solution: Implemented delayed `revokeObjectURL`.
- [x] [P1-High] Recording quality hardcoded
  - Solution: Added low/balanced/high quality settings with bitrate control.

### Mobile & Quality
- [x] [P1-High] Whiteboard not usable on mobile
  - Solution: Implemented touch handlers and `touch-none` styling.
- [x] [P1-High] Layout breaks on small screens (Mobile Navigation)
  - Solution: Implemented tab navigation (Video | Board | Chat) for mobile.
- [x] [P1-High] Mobile detection logic hardcoded
  - Solution: Centralized `useIsMobile` hook with Tailwind breakpoints.
- [x] [P1-High] No unit tests for OnlineSessionService
  - Solution: Created `OnlineSessionServiceTest.java`.
- [x] [P2-Medium] No frontend tests for critical hooks
  - Solution: Added Vitest tests for all critical hooks.
- [x] [P1-High] Chat messages not paginated
  - Solution: Implemented database-level pagination and infinite scroll.
