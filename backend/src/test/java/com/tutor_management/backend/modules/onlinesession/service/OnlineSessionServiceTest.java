package com.tutor_management.backend.modules.onlinesession.service;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.notification.event.OnlineSessionCreatedEvent;
import com.tutor_management.backend.modules.notification.event.OnlineSessionEndedEvent;
import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.OnlineSessionResponse;
import com.tutor_management.backend.modules.onlinesession.entity.OnlineSession;
import com.tutor_management.backend.modules.onlinesession.enums.RoomStatus;
import com.tutor_management.backend.modules.onlinesession.repository.OnlineSessionRepository;
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
}
