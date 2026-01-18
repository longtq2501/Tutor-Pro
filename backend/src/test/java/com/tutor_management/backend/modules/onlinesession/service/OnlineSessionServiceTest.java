package com.tutor_management.backend.modules.onlinesession.service;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.notification.event.OnlineSessionCreatedEvent;
import com.tutor_management.backend.modules.notification.event.OnlineSessionEndedEvent;
import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.GlobalStatsResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.JoinRoomResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.OnlineSessionResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.RoomStatsResponse;
import com.tutor_management.backend.modules.onlinesession.entity.OnlineSession;
import com.tutor_management.backend.modules.onlinesession.enums.RoomStatus;
import com.tutor_management.backend.modules.onlinesession.exception.RoomAlreadyEndedException;
import com.tutor_management.backend.modules.onlinesession.repository.OnlineSessionRepository;
import com.tutor_management.backend.modules.onlinesession.security.RoomTokenService;
import com.tutor_management.backend.modules.auth.Role;
import com.tutor_management.backend.modules.student.entity.Student;
import com.tutor_management.backend.modules.student.repository.StudentRepository;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.tutor.repository.TutorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OnlineSessionService Unit Tests")
class OnlineSessionServiceTest {

    @Mock
    private OnlineSessionRepository onlineSessionRepository;

    @Mock
    private TutorRepository tutorRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private OnlineSessionServiceImpl onlineSessionService;

    @Mock
    private Clock clock;

    @Mock
    private RoomTokenService roomTokenService;

    private final Long userId = 1L;
    private final Long tutorId = 10L;
    private final Long studentId = 20L;
    private CreateOnlineSessionRequest request;
    private User user;
    private Tutor tutor;
    private Student student;

    @BeforeEach
    void setUp() {
        request = CreateOnlineSessionRequest.builder()
                .studentId(studentId)
                .scheduledStart(LocalDateTime.now().plusHours(1))
                .scheduledEnd(LocalDateTime.now().plusHours(2))
                .build();

        user = User.builder().id(userId).fullName("Tutor User").build();
        tutor = Tutor.builder().id(tutorId).fullName("Tutor Name").user(user).build();
        student = Student.builder().id(studentId).name("Student Name").build();
    }

    @Test
    @DisplayName("Should create session and publish complete event")
    void createSession_Success() {
        // Given
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(tutorRepository.findByUserId(userId)).thenReturn(Optional.of(tutor));
        when(tutorRepository.findById(tutorId)).thenReturn(Optional.of(tutor));
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        
        when(onlineSessionRepository.save(any(OnlineSession.class))).thenAnswer(i -> {
            OnlineSession s = i.getArgument(0);
            s.setId(100L);
            return s;
        });

        // When
        OnlineSessionResponse response = onlineSessionService.createSession(request, userId);

        // Then
        assertNotNull(response);
        assertEquals(studentId, response.getStudentId());
        
        // ✅ ADD COMPREHENSIVE EVENT VALIDATION
        ArgumentCaptor<OnlineSessionCreatedEvent> eventCaptor = ArgumentCaptor.forClass(OnlineSessionCreatedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        
        OnlineSessionCreatedEvent event = eventCaptor.getValue();
        
        // Verify all event fields
        assertEquals(100L, event.getSessionId());
        assertNotNull(event.getRoomId()); // ✅ Room ID generated
        assertFalse(event.getRoomId().isEmpty()); // ✅ Not empty
        
        assertEquals(user.getId(), event.getTutorId());
        assertEquals("Tutor Name", event.getTutorName());
        
        assertEquals(studentId, event.getStudentId());
        assertEquals("Student Name", event.getStudentName());
        
        assertEquals(request.getScheduledStart(), event.getScheduledStart());
        
        // ✅ Verify response completeness
        assertEquals("WAITING", response.getRoomStatus());
        assertEquals(tutorId, response.getTutorId());
        assertEquals("Tutor Name", response.getTutorName());
        assertEquals(studentId, response.getStudentId());
        assertEquals("Student Name", response.getStudentName());
    }

    @Test
    @DisplayName("Should end session and calculate billable duration")
    void endSession_Success() {
        // Given
        String roomId = "room-xyz";
        
        // Fixed times
        LocalDateTime tutorJoined = LocalDateTime.of(2024, 1, 15, 14, 0);
        LocalDateTime studentJoined = LocalDateTime.of(2024, 1, 15, 14, 5);
        LocalDateTime sessionEnd = LocalDateTime.of(2024, 1, 15, 14, 45);
        
        // ✅ Mock Clock to return sessionEnd time
        Clock fixedClock = Clock.fixed(
            sessionEnd.atZone(ZoneId.systemDefault()).toInstant(),
            ZoneId.systemDefault()
        );
        when(clock.instant()).thenReturn(fixedClock.instant());
        when(clock.getZone()).thenReturn(fixedClock.getZone());
        
        OnlineSession session = OnlineSession.builder()
                .id(100L)
                .roomId(roomId)
                .roomStatus(RoomStatus.ACTIVE)
                .tutor(tutor)
                .student(student)
                .tutorJoinedAt(tutorJoined)
                .studentJoinedAt(studentJoined)
                .build();

        when(onlineSessionRepository.findByRoomId(roomId)).thenReturn(Optional.of(session));
        
        // Mock User lookup
        User studentUser = User.builder().id(123L).studentId(studentId).build();
        when(userRepository.findByStudentId(studentId))
                .thenReturn(List.of(studentUser));
        
        when(onlineSessionRepository.save(any(OnlineSession.class)))
                .thenAnswer(i -> i.getArgument(0));

        // When
        OnlineSessionResponse response = onlineSessionService.endSession(roomId, userId);

        // Then
        assertEquals("ENDED", response.getRoomStatus());
        
        // ✅ Now duration will be correct: 14:05 to 14:45 = 40 minutes
        assertEquals(40, session.getTotalDurationMinutes());
        
        verify(eventPublisher, times(1)).publishEvent(any(OnlineSessionEndedEvent.class));
    }

    @Test
    @DisplayName("Should join room and return token with TURN servers from config")
    void joinRoom_Success() {
        // Given
        String roomId = "room-join-123";
        LocalDateTime now = LocalDateTime.of(2024, 1, 15, 10, 0);
        when(clock.instant()).thenReturn(now.atZone(ZoneId.systemDefault()).toInstant());
        when(clock.getZone()).thenReturn(ZoneId.systemDefault());

        OnlineSession session = OnlineSession.builder()
                .roomId(roomId)
                .roomStatus(RoomStatus.WAITING) // Start as waiting
                .tutor(tutor)
                .student(student)
                .build();

        when(onlineSessionRepository.findByRoomId(roomId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        user.setRole(Role.TUTOR);
        String mockToken = "mock-jwt-token";
        when(roomTokenService.generateToken(roomId, userId, Role.TUTOR)).thenReturn(mockToken);
        when(onlineSessionRepository.save(any(OnlineSession.class))).thenAnswer(i -> i.getArgument(0));

        // When
        JoinRoomResponse response = onlineSessionService.joinRoom(roomId, userId);

        // Then
        assertNotNull(response);
        assertEquals(mockToken, response.getToken());
        
        // Verify Join Tracking
        assertEquals(now, session.getTutorJoinedAt());
        assertEquals(RoomStatus.ACTIVE, session.getRoomStatus());
        assertEquals(now, session.getActualStart());
        
        verify(onlineSessionRepository).save(session);
        verify(roomTokenService).generateToken(roomId, userId, Role.TUTOR);
    }

    @Test
    @DisplayName("Should throw exception when joining an ended room")
    void joinRoom_EndedRoom_ThrowsException() {
        // Given
        String roomId = "room-ended";
        OnlineSession session = OnlineSession.builder()
                .roomStatus(RoomStatus.ENDED)
                .build();
        when(onlineSessionRepository.findByRoomId(roomId)).thenReturn(Optional.of(session));

        // When & Then
        assertThrows(RoomAlreadyEndedException.class, () -> onlineSessionService.joinRoom(roomId, userId));
    }

    @Test
    @DisplayName("Should retrieve room stats correctly using RoomStatsResponse")
    void getRoomStats_Success() {
        // Given
        String roomId = "room-stats-123";
        OnlineSession session = OnlineSession.builder()
                .roomId(roomId)
                .roomStatus(RoomStatus.ACTIVE)
                .recordingEnabled(true)
                .totalDurationMinutes(15)
                .tutor(tutor)
                .student(student)
                .tutorJoinedAt(LocalDateTime.now())
                .build();

        when(onlineSessionRepository.findByRoomId(roomId)).thenReturn(Optional.of(session));

        // When
        RoomStatsResponse stats = onlineSessionService.getRoomStats(roomId, userId);

        // Then
        assertNotNull(stats);
        assertEquals(roomId, stats.getRoomId());
        assertEquals("ACTIVE", stats.getRoomStatus());
        assertTrue(stats.getRecordingEnabled());
        assertEquals(15, stats.getDurationMinutes());
        assertEquals(1, stats.getParticipantCount()); // Tutor is present
    }

    @Test
    @DisplayName("Should retrieve global stats")
    void getGlobalStats_Success() {
        // Given
        when(onlineSessionRepository.count()).thenReturn(100L);
        when(onlineSessionRepository.countByRoomStatus(RoomStatus.ACTIVE)).thenReturn(5L);
        when(onlineSessionRepository.countByRoomStatus(RoomStatus.WAITING)).thenReturn(10L);
        when(onlineSessionRepository.countByRoomStatus(RoomStatus.ENDED)).thenReturn(85L);
        when(onlineSessionRepository.sumTotalDurationMinutes()).thenReturn(Optional.of(5000L));
        
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0); // This is risky due to time
        // Use a fixed clock for deterministic today count
        LocalDateTime fixedNow = LocalDateTime.of(2024, 1, 15, 12, 0);
        when(clock.instant()).thenReturn(fixedNow.atZone(ZoneId.systemDefault()).toInstant());
        when(clock.getZone()).thenReturn(ZoneId.systemDefault());
        
        when(onlineSessionRepository.countByScheduledStartBetween(any(), any())).thenReturn(12L);

        // When
        GlobalStatsResponse response = onlineSessionService.getGlobalStats();

        // Then
        assertNotNull(response);
        assertEquals(100L, response.getTotalSessions());
        assertEquals(5L, response.getActiveSessions());
        assertEquals(50.0, response.getAverageSessionDuration());
    }
}
