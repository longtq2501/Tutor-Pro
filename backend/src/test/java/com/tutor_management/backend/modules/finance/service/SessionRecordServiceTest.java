package com.tutor_management.backend.modules.finance.service;

import com.tutor_management.backend.modules.auth.RoleEntity;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.finance.repository.SessionRecordRepository;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.tutor.repository.TutorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.mockito.Mockito.*;

import com.tutor_management.backend.modules.admin.service.AdminStatsService;
import com.tutor_management.backend.modules.finance.LessonStatus;
import com.tutor_management.backend.modules.finance.dto.request.SessionRecordUpdateRequest;
import com.tutor_management.backend.modules.finance.dto.response.SessionRecordResponse;
import com.tutor_management.backend.modules.finance.entity.SessionRecord;
import com.tutor_management.backend.modules.onlinesession.repository.OnlineSessionRepository;
import com.tutor_management.backend.modules.student.entity.Student;
import static org.junit.jupiter.api.Assertions.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@ExtendWith(MockitoExtension.class)
class SessionRecordServiceTest {

    @Mock
    private SessionRecordRepository sessionRecordRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TutorRepository tutorRepository;
    @Mock
    private OnlineSessionRepository onlineSessionRepository;
    @Mock
    private AdminStatsService adminStatsService;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private SessionRecordService sessionRecordService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void deleteSessionsByMonth_Admin_ShouldDeleteAll() {
        // Arrange
        String month = "2024-01";
        String adminEmail = "admin@test.com";
        RoleEntity adminRole = RoleEntity.builder().name("ADMIN").build();
        User admin = User.builder().id(1L).email(adminEmail).role(adminRole).build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(adminEmail);
        when(userRepository.findByEmail(adminEmail)).thenReturn(Optional.of(admin));

        // Act
        sessionRecordService.deleteSessionsByMonth(month);

        // Assert
        verify(sessionRecordRepository, times(1)).deleteByMonth(month);
        verify(sessionRecordRepository, never()).deleteByMonthAndTutorId(anyString(), anyLong());
    }

    @Test
    void deleteSessionsByMonth_Tutor_ShouldDeleteOnlyOwn() {
        // Arrange
        String month = "2024-01";
        String tutorEmail = "tutor@test.com";
        Long tutorId = 100L;
        RoleEntity tutorRole = RoleEntity.builder().name("TUTOR").build();
        User tutorUser = User.builder().id(2L).email(tutorEmail).role(tutorRole).build();
        Tutor tutorProfile = Tutor.builder().id(tutorId).user(tutorUser).build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(tutorEmail);
        when(userRepository.findByEmail(tutorEmail)).thenReturn(Optional.of(tutorUser));
        when(tutorRepository.findByUserId(2L)).thenReturn(Optional.of(tutorProfile));

        // Act
        sessionRecordService.deleteSessionsByMonth(month);

        // Assert
        verify(sessionRecordRepository, times(1)).deleteByMonthAndTutorId(month, tutorId);
        verify(sessionRecordRepository, never()).deleteByMonth(anyString());
    }

    @Test
    void getAllUnpaidSessions_TaughtOnly_UsesStatusFilteredQuery() {
        // Arrange
        String tutorEmail = "tutor2@test.com";
        Long tutorId = 500L;
        RoleEntity tutorRole = RoleEntity.builder().name("TUTOR").build();
        User tutorUser = User.builder().id(3L).email(tutorEmail).role(tutorRole).build();
        Tutor tutorProfile = Tutor.builder().id(tutorId).user(tutorUser).build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(tutorEmail);
        when(userRepository.findByEmail(tutorEmail)).thenReturn(Optional.of(tutorUser));
        when(tutorRepository.findByUserId(3L)).thenReturn(Optional.of(tutorProfile));

        when(sessionRecordRepository.findByPaidFalseAndTutorIdAndStatusInOrderBySessionDateDesc(eq(tutorId), any(Pageable.class)))
            .thenReturn(Page.empty());

        // Act
        sessionRecordService.getAllUnpaidSessions(Pageable.unpaged(), true);

        // Assert
        verify(sessionRecordRepository).findByPaidFalseAndTutorIdAndStatusInOrderBySessionDateDesc(eq(tutorId), any(Pageable.class));
        verify(sessionRecordRepository, never()).findByPaidFalseAndTutorIdOrderBySessionDateDesc(anyLong(), any(Pageable.class));
    }

    @Test
    void getAllUnpaidSessions_Default_NoStatusFilter() {
        // Arrange
        String tutorEmail = "tutor3@test.com";
        Long tutorId = 600L;
        RoleEntity tutorRole = RoleEntity.builder().name("TUTOR").build();
        User tutorUser = User.builder().id(4L).email(tutorEmail).role(tutorRole).build();
        Tutor tutorProfile = Tutor.builder().id(tutorId).user(tutorUser).build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(tutorEmail);
        when(userRepository.findByEmail(tutorEmail)).thenReturn(Optional.of(tutorUser));
        when(tutorRepository.findByUserId(4L)).thenReturn(Optional.of(tutorProfile));

        when(sessionRecordRepository.findByPaidFalseAndTutorIdOrderBySessionDateDesc(eq(tutorId), any(Pageable.class)))
            .thenReturn(Page.empty());

        // Act
        sessionRecordService.getAllUnpaidSessions(Pageable.unpaged(), false);

        // Assert
        verify(sessionRecordRepository).findByPaidFalseAndTutorIdOrderBySessionDateDesc(eq(tutorId), any(Pageable.class));
        verify(sessionRecordRepository, never()).findByPaidFalseAndTutorIdAndStatusInOrderBySessionDateDesc(anyLong(), any(Pageable.class));
    }

    @Test
    void toggleCompleted_WhenScheduled_MarksCompleted() {
        // Arrange
        Long sessionId = 10L;
        Student student = Student.builder().id(1L).name("Test Student").nguon("day_rieng").build();
        SessionRecord record = SessionRecord.builder()
                .id(sessionId)
                .student(student)
                .month("2024-01")
                .sessions(1)
                .hours(2.0)
                .pricePerHour(100000L)
                .totalAmount(200000L)
                .sessionDate(LocalDate.of(2024, 1, 10))
                .createdAt(LocalDateTime.now())
                .status(LessonStatus.SCHEDULED)
                .completed(false)
                .paid(false)
                .version(0)
                .build();

        when(securityContext.getAuthentication()).thenReturn(null);
        when(sessionRecordRepository.findById(sessionId)).thenReturn(Optional.of(record));
        when(sessionRecordRepository.saveAndFlush(any(SessionRecord.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        SessionRecordResponse response = sessionRecordService.toggleCompleted(sessionId, 0);

        // Assert
        assertTrue(response.getCompleted());
        assertEquals("COMPLETED", response.getStatus());
        verify(sessionRecordRepository).saveAndFlush(record);
    }

    @Test
    void toggleCompleted_WhenCompleted_MarksScheduled() {
        // Arrange
        Long sessionId = 11L;
        Student student = Student.builder().id(1L).name("Test Student").nguon("day_rieng").build();
        SessionRecord record = SessionRecord.builder()
                .id(sessionId)
                .student(student)
                .month("2024-01")
                .sessions(1)
                .hours(2.0)
                .pricePerHour(100000L)
                .totalAmount(200000L)
                .sessionDate(LocalDate.of(2024, 1, 10))
                .createdAt(LocalDateTime.now())
                .status(LessonStatus.COMPLETED)
                .completed(true)
                .paid(false)
                .version(1)
                .build();

        when(securityContext.getAuthentication()).thenReturn(null);
        when(sessionRecordRepository.findById(sessionId)).thenReturn(Optional.of(record));
        when(sessionRecordRepository.saveAndFlush(any(SessionRecord.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        SessionRecordResponse response = sessionRecordService.toggleCompleted(sessionId, 1);

        // Assert
        assertFalse(response.getCompleted());
        assertEquals("SCHEDULED", response.getStatus());
        verify(sessionRecordRepository).saveAndFlush(record);
    }

    @Test
    void toggleCompleted_WhenPaid_ThrowsException() {
        // Arrange
        Long sessionId = 12L;
        SessionRecord record = SessionRecord.builder()
                .id(sessionId)
                .status(LessonStatus.PAID)
                .paid(true)
                .completed(true)
                .version(0)
                .build();

        when(securityContext.getAuthentication()).thenReturn(null);
        when(sessionRecordRepository.findById(sessionId)).thenReturn(Optional.of(record));

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> sessionRecordService.toggleCompleted(sessionId, 0));
        assertTrue(ex.getMessage().contains("đã thanh toán"));
        verify(sessionRecordRepository, never()).saveAndFlush(any());
    }

    @Test
    void updateRecord_WhenCancelled_ResetsPaidAndCompleted() {
        // Arrange
        Long sessionId = 13L;
        Student student = Student.builder().id(1L).name("Test Student").nguon("day_rieng").build();
        SessionRecord record = SessionRecord.builder()
                .id(sessionId)
                .student(student)
                .month("2024-01")
                .sessions(1)
                .hours(2.0)
                .pricePerHour(100000L)
                .totalAmount(200000L)
                .sessionDate(LocalDate.of(2024, 1, 10))
                .createdAt(LocalDateTime.now())
                .status(LessonStatus.PAID)
                .completed(true)
                .paid(true)
                .paidAt(LocalDateTime.now())
                .version(2)
                .build();

        SessionRecordUpdateRequest updateReq = new SessionRecordUpdateRequest();
        updateReq.setStatus("CANCELLED_BY_STUDENT");
        updateReq.setVersion(2);

        when(securityContext.getAuthentication()).thenReturn(null);
        when(sessionRecordRepository.findById(sessionId)).thenReturn(Optional.of(record));
        when(sessionRecordRepository.saveAndFlush(any(SessionRecord.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        SessionRecordResponse response = sessionRecordService.updateRecord(sessionId, updateReq);

        // Assert
        assertEquals("CANCELLED_BY_STUDENT", response.getStatus());
        assertFalse(response.getPaid());
        assertNull(response.getPaidAt());
        assertFalse(response.getCompleted());
        verify(sessionRecordRepository).saveAndFlush(record);
    }
}
