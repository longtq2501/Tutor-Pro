package com.tutor_management.backend.modules.onlinesession.service;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.notification.event.OnlineSessionCreatedEvent;
import com.tutor_management.backend.modules.notification.event.OnlineSessionEndedEvent;
import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.OnlineSessionResponse;
import com.tutor_management.backend.modules.onlinesession.entity.OnlineSession;
import com.tutor_management.backend.modules.onlinesession.enums.RoomStatus;
import com.tutor_management.backend.modules.onlinesession.exception.RoomNotFoundException;
import com.tutor_management.backend.modules.onlinesession.repository.OnlineSessionRepository;
import com.tutor_management.backend.modules.student.entity.Student;
import com.tutor_management.backend.modules.student.repository.StudentRepository;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.tutor.repository.TutorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
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
    private final Clock clock; // ✅ ADD Clock injection

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
