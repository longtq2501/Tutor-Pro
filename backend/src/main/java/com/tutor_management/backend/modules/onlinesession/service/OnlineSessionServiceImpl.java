package com.tutor_management.backend.modules.onlinesession.service;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.notification.event.OnlineSessionCreatedEvent;
import com.tutor_management.backend.modules.notification.event.OnlineSessionEndedEvent;
import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.JoinRoomResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.OnlineSessionResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.RoomStatsResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.GlobalStatsResponse;
import com.tutor_management.backend.modules.onlinesession.entity.OnlineSession;
import com.tutor_management.backend.modules.onlinesession.enums.RoomStatus;
import com.tutor_management.backend.modules.onlinesession.exception.RoomNotFoundException;
import com.tutor_management.backend.modules.onlinesession.exception.RoomAlreadyEndedException;
import com.tutor_management.backend.modules.onlinesession.repository.OnlineSessionRepository;
import com.tutor_management.backend.modules.onlinesession.security.RoomTokenService;
import com.tutor_management.backend.modules.auth.Role;
import com.tutor_management.backend.modules.student.entity.Student;
import com.tutor_management.backend.modules.student.repository.StudentRepository;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.tutor.repository.TutorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OnlineSessionServiceImpl implements OnlineSessionService {

    private final OnlineSessionRepository onlineSessionRepository;
    private final TutorRepository tutorRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final Clock clock;
    private final RoomTokenService roomTokenService;
    private final PresenceService presenceService;

    // Simplified TURN servers to avoid @Value list binding issues in YAML
    private final List<Map<String, Object>> turnServers = List.of(
            Map.of("urls", "stun:stun.l.google.com:19302"),
            Map.of("urls", "stun:stun1.l.google.com:19302"),
            Map.of("urls", "stun:stun2.l.google.com:19302")
    );

    @Override
    @Transactional
    public OnlineSessionResponse createSession(CreateOnlineSessionRequest request, Long userId) {
        log.info("Creating new online session for student ID: {}", request.getStudentId());

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Current user not found"));

        Long tutorId = request.getTutorId();
        if (tutorId == null) {
            Tutor tutor = tutorRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Tutor profile not found for current user"));
            tutorId = tutor.getId();
        }

        Long finalTutorId = tutorId;
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + finalTutorId));
        
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + request.getStudentId()));

        OnlineSession session = OnlineSession.builder()
                .roomId(UUID.randomUUID().toString())
                .roomStatus(RoomStatus.WAITING)
                .scheduledStart(request.getScheduledStart())
                .scheduledEnd(request.getScheduledEnd())
                .tutor(tutor)
                .student(student)
                .build();

        OnlineSession saved = onlineSessionRepository.save(session);

        // Publish Event for Notifications
        eventPublisher.publishEvent(OnlineSessionCreatedEvent.builder()
                .sessionId(saved.getId())
                .roomId(saved.getRoomId())
                .tutorId(tutor.getUser().getId()) // Use User ID for notification targeting
                .tutorName(tutor.getFullName())
                .studentId(request.getStudentId())
                .studentName(student.getName())
                .scheduledStart(saved.getScheduledStart())
                .build());

        return mapToResponse(saved);
    }


    @Override
    @Transactional
    public JoinRoomResponse joinRoom(String roomId, Long userId) {
        log.info("User {} joining room {}", userId, roomId);
        
        OnlineSession session = onlineSessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        // ✅ Check room status
        if (session.getRoomStatus() == RoomStatus.ENDED) {
            throw new RoomAlreadyEndedException("Cannot join: session has ended");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ Record join time
        LocalDateTime now = LocalDateTime.now(clock);
        
        if (user.getRole() == Role.TUTOR && session.getTutorJoinedAt() == null) {
            session.setTutorJoinedAt(now);
            log.info("Tutor {} joined room {}", userId, roomId);
        } else if (user.getRole() == Role.STUDENT) {
            if (user.getStudentId() != null && user.getStudentId().equals(session.getStudent().getId())) {
                if (session.getStudentJoinedAt() == null) {
                    session.setStudentJoinedAt(now);
                    log.info("Student {} joined room {}", userId, roomId);
                }
            }
        }
        
        // ✅ Activate room if still waiting
        if (session.getRoomStatus() == RoomStatus.WAITING) {
            session.setRoomStatus(RoomStatus.ACTIVE);
            session.setActualStart(now);
            log.info("Room {} activated", roomId);
        }
        
        onlineSessionRepository.save(session);

        String token = roomTokenService.generateToken(roomId, userId, user.getRole());

        return JoinRoomResponse.builder()
                .token(token)
                .session(mapToResponse(session))
                .turnServers(turnServers)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public RoomStatsResponse getRoomStats(String roomId, Long userId) {
        log.info("Fetching stats for room {} by user {}", roomId, userId);
        
        OnlineSession session = onlineSessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        return RoomStatsResponse.builder()
                .roomId(roomId)
                .roomStatus(session.getRoomStatus().name())
                .tutorName(session.getTutor().getFullName())
                .studentName(session.getStudent().getName())
                .tutorPresent(session.getTutorJoinedAt() != null)
                .studentPresent(session.getStudentJoinedAt() != null)
                .participantCount(calculateParticipantCount(session))
                .scheduledStart(session.getScheduledStart())
                .scheduledEnd(session.getScheduledEnd())
                .actualStart(session.getActualStart())
                .actualEnd(session.getActualEnd())
                .tutorJoinedAt(session.getTutorJoinedAt())
                .studentJoinedAt(session.getStudentJoinedAt())
                .durationMinutes(session.getTotalDurationMinutes())
                .recordingEnabled(session.getRecordingEnabled())
                .recordingDownloaded(session.getRecordingDownloaded())
                .recordingDurationMinutes(session.getRecordingDurationMinutes())
                .recordingFileSizeMb(session.getRecordingFileSizeMb() != null 
                    ? session.getRecordingFileSizeMb().toString() : null)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public GlobalStatsResponse getGlobalStats() {
        long total = onlineSessionRepository.count();
        long active = onlineSessionRepository.countByRoomStatus(RoomStatus.ACTIVE);
        long waiting = onlineSessionRepository.countByRoomStatus(RoomStatus.WAITING);
        long ended = onlineSessionRepository.countByRoomStatus(RoomStatus.ENDED);
        
        Long totalDuration = onlineSessionRepository.sumTotalDurationMinutes().orElse(0L);
        
        long today = onlineSessionRepository.countByScheduledStartBetween(
                LocalDate.now(clock).atStartOfDay(),
                LocalDate.now(clock).atStartOfDay().plusDays(1)
        );
        
        return GlobalStatsResponse.builder()
                .totalSessions(total)
                .activeSessions(active)
                .waitingSessions(waiting)
                .endedSessions(ended)
                .totalDurationMinutes(totalDuration)
                .sessionsToday(today)
                .averageSessionDuration(total > 0 ? (double) totalDuration / total : 0.0)
                .build();
    }

    private Integer calculateParticipantCount(OnlineSession session) {
        if (session.getRoomStatus() != RoomStatus.ACTIVE) {
            return 0;
        }
        
        int count = 0;
        if (session.getTutorJoinedAt() != null) count++;
        if (session.getStudentJoinedAt() != null) count++;
        return count;
    }

    @Override
    @Transactional
    public OnlineSessionResponse endSession(String roomId, Long userId) {
        log.info("Ending online session for room ID: {}", roomId);

        OnlineSession session = onlineSessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Online session not found for room: " + roomId));

        if (session.getRoomStatus() == RoomStatus.ENDED) {
                return mapToResponse(session);
        }

        session.setRoomStatus(RoomStatus.ENDED);
        LocalDateTime endTime = LocalDateTime.now(clock);
        session.setActualEnd(endTime);

        // Calculate billable time: overlap between tutor and student presence
        if (session.getTutorJoinedAt() != null && session.getStudentJoinedAt() != null) {
                LocalDateTime overlapStart = session.getTutorJoinedAt().isAfter(session.getStudentJoinedAt()) 
                ? session.getTutorJoinedAt() : session.getStudentJoinedAt();
                
                if (endTime.isAfter(overlapStart)) {
                long minutes = java.time.Duration.between(overlapStart, endTime).toMinutes();
                session.setTotalDurationMinutes((int) minutes);
                }
        }

        OnlineSession saved = onlineSessionRepository.save(session);

        // ✅ FIX: Get User IDs correctly
        Long tutorUserId = saved.getTutor().getUser().getId(); // ✅ Tutor has User relationship
        
        // ✅ FIX: Find student's User via userRepository
        Long studentUserId = userRepository.findByStudentId(saved.getStudent().getId())
                .stream()
                .findFirst()
                .map(User::getId)
                .orElse(null); // ✅ Graceful handling if User not found

        if (studentUserId == null) {
                log.warn("No User mapping found for student ID: {}", saved.getStudent().getId());
                // Still save session, just don't notify student
        }

        // Publish End Event
        eventPublisher.publishEvent(OnlineSessionEndedEvent.builder()
                .sessionId(saved.getId())
                .roomId(saved.getRoomId())
                .tutorId(tutorUserId) // ✅ Correct
                .studentId(studentUserId) // ✅ Correct (may be null, handled in listener)
                .durationMinutes(saved.getTotalDurationMinutes())
                .build());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void updateHeartbeat(String roomId, Long userId) {
        OnlineSession session = onlineSessionRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        // Only process for ACTIVE rooms
        if (session.getRoomStatus() != RoomStatus.ACTIVE) {
            return;
        }

        // ✅ FIX: Check participant correctly to avoid NPE
        boolean isParticipant = false;
        
        // Check if tutor
        if (session.getTutor().getUser() != null && 
            session.getTutor().getUser().getId().equals(userId)) {
            isParticipant = true;
        }
        
        // ✅ Check if student (via User.studentId)
        if (!isParticipant) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getStudentId() != null) {
                isParticipant = user.getStudentId().equals(session.getStudent().getId());
            }
        }

        if (isParticipant) {
            // ✅ Update in-memory presence (fast) - avoiding constant DB writes
            presenceService.updateHeartbeat(roomId, userId);
            log.trace("Heartbeat updated for room {} by user {}", roomId, userId);
        } else {
            log.warn("Heartbeat rejected: user {} not in room {}", userId, roomId);
        }
    }

    @Override
    @Transactional
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    public void detectInactiveParticipants() {
        // Get all ACTIVE rooms
        List<OnlineSession> activeSessions = onlineSessionRepository
                .findByRoomStatus(RoomStatus.ACTIVE);
        
        for (OnlineSession session : activeSessions) {
            boolean tutorActive = presenceService.isUserActive(
                session.getRoomId(), 
                session.getTutor().getUser().getId(),
                65 // 30s heartbeat + 35s grace period
            );
            
            // Check student
            User studentUser = userRepository.findByStudentId(session.getStudent().getId())
                .stream().findFirst().orElse(null);
            
            boolean studentActive = false;
            if (studentUser != null) {
                studentActive = presenceService.isUserActive(
                    session.getRoomId(),
                    studentUser.getId(),
                    65
                );
            }
            
            // If both inactive for 60+ seconds
            if (!tutorActive && !studentActive) {
                log.warn("Room {} completely inactive for 60s. Last heartbeat missed.", session.getRoomId());
                // Future: Implement auto-end or notification logic here
            } else if (!tutorActive) {
                log.info("Tutor disconnected from room {}", session.getRoomId());
            } else if (!studentActive) {
                log.info("Student disconnected from room {}", session.getRoomId());
            }

            // Sync presence to DB occasionally (Optional, but helps for visual stats)
            if (tutorActive || studentActive) {
                session.setLastActivityAt(LocalDateTime.now(clock));
                onlineSessionRepository.save(session);
            }
        }
    }

    private OnlineSessionResponse mapToResponse(OnlineSession session) {
        return OnlineSessionResponse.builder()
                .id(session.getId())
                .roomId(session.getRoomId())
                .roomStatus(session.getRoomStatus().name())
                .scheduledStart(session.getScheduledStart())
                .scheduledEnd(session.getScheduledEnd())
                .tutorId(session.getTutor().getId())
                .tutorName(session.getTutor().getFullName())
                .studentId(session.getStudent().getId())
                .studentName(session.getStudent().getName())
                .build();
    }
}
