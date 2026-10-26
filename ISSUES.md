# Tutor Onboarding — Issues & Optimization

## Performance Issues

## Logic/Bug Issues

## UI/UX Issues

---

- **[P0-Critical] Live Room Media Graceful Fallback & WebRTC Recvonly Support**
  - **Resolution**: Resolved issue where missing camera/mic on a user device triggered `ErrorRecoveryDialog` ("Kết nối thất bại"), trapping the user despite active WebSocket, Whiteboard, and Chat connections. Decoupled media device errors from connection state so `ErrorRecoveryDialog` only appears on true connection failure (`state.connectionState === 'FAILED'`) and includes a non-blocking continue option. Added audio-only fallback and `navigator.mediaDevices.ondevicechange` auto-recovery in `useMediaStream.ts`. Configured `addTransceiver('video', { direction: 'recvonly' })` and `addTransceiver('audio', { direction: 'recvonly' })` in `useWebRTCSignaling.ts` so users without webcams can still view incoming peer video/audio. Replaced intrusive modal with contextual dismissible banner in `RoomMainContent.tsx`.
- **[P0-Critical] Fix RoomTokenService 400 Bad Request on Live Room Join**
  - **Resolution**: Identified `io.jsonwebtoken.io.DecodingException: Illegal base64 character: _` when generating join tokens in `RoomTokenService.java`. The default secret key in `application.yaml` (`your_online_session_random_secret_string`) contained underscores, which are invalid in standard Base64, and was shorter than the 256-bit requirement for HMAC-SHA256. Updated `application.yaml` with a valid 256-bit Base64 secret key and added defensive fallback in `RoomTokenService` using SHA-256 key stretching for non-base64 or weak keys. All unit tests verified.
- **[P1-High] Separate Edit Mode from 2-Column Feedback View Layout**
  - **Resolution**: Fixed layout collision where entering Edit Mode on a completed session forced `EditModeForm` (which already has its own 2-column layout: Form fields + Library selection) into a cramped 380px left pane while `SmartFeedbackForm` occupied the right pane. Restricted the 2-column view split to `mode === 'view' && isTaughtOrPaid`. In `mode === 'edit'`, the modal gives 100% width to `EditModeForm` (`max-w-4xl lg:h-[600px]`), providing ample room for time/subject/status/notes on the left (290px) and library selection on the right (flex-1).
- **[P1-High] Mobile Slide-Over Pattern for Completed Lesson Feedback**
  - **Resolution**: Replaced the cramped vertical split on mobile with an interactive slide-over pattern: the main mobile view presents session details and a clean "Phiếu đánh giá buổi học" trigger card. When clicked, the feedback form slides in full-height from the right (`motion.div` slide-over with navigation back button), providing 100% viewport space for comfortable rating and comment typing. On desktop, the balanced 2-column layout remains intact.
- **[P1-High] Balance Modal Edit Height & Fix Status Badge Color Overrides**
  - **Resolution**: Balanced column heights between the edit form fields (~320px) and the library selection container (~320px), compacted empty state padding, and set `overflow-y-auto lg:overflow-hidden` with `max-w-4xl lg:h-[600px]` to eliminate outer modal scrollbar on desktop while preserving full scrollability on mobile. Replaced default `Badge` with explicit border/background span styling in `ModalHeader` and `StudentCard` to prevent Shadcn `bg-primary hover:bg-primary/80` from turning status badges black.
- **[P1-High] Overhaul Lesson Detail Modal UI & Empty State for Completed Sessions**
  - **Resolution**: Redesigned `LessonDetailModal` to align with Tutor Pro design system: moved footer to root level spanning full modal width, replaced solid bright blue header with clean status-themed header, balanced column proportions (380px left / remaining right instead of 300px / 850px), fixed excessive 90vh empty height, and added a dedicated empty state with call-to-action for `SmartFeedbackForm` when no feedback is written yet.
- **[P0-Critical] Revert to Java 21 Target & Restored getFirst()**
  - **Resolution**: Reverted the target Java version from `17` back to `21` in `pom.xml` and restored all `.getFirst()` calls. This ensures compatibility with the production build environment and deployment pipeline (which runs on JDK 21), resolving the 502 Bad Gateway / CORS errors caused by compilation failures on the GitHub Actions runner.
- **[P1-High] ESLint error in useOnboarding.ts**
  - **Resolution**: Refactored the `useOnboarding` hook to dynamically compute the `isTourVisible` state in render phase, removing synchronous `setState` updates from the `useEffect` body. Resolved all lint errors.
- **[P1-High] Avoid unnecessary re-renders or state changes during page transitions**
  - **Resolution**: Cleaned up the effect to run only when needed and avoided redundant renders using derived state.
- **[P2-Medium] Verify overlay positioning and z-index overlap**
  - **Resolution**: Verified that the spotlight overlay has a `z-index` of 998 and the tour step card has a `z-index` of 999, ensuring it remains on top of all other page elements.
