package com.tutor_management.backend.modules.dashboard;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.tutor_management.backend.modules.auth.Role;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.document.repository.DocumentRepository;
import com.tutor_management.backend.modules.finance.repository.SessionRecordRepository;
import com.tutor_management.backend.modules.student.repository.StudentRepository;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.tutor.repository.TutorRepository;

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
import java.util.ArrayList;

@ExtendWith(MockitoExtension.class)
public class DashboardServiceTest {

    @Mock
    private StudentRepository studentRepository;
    @Mock
    private SessionRecordRepository sessionRecordRepository;
    @Mock
    private DocumentRepository documentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TutorRepository tutorRepository;
    
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private DashboardService dashboardService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testGetDashboardStats_ForAdmin_ShouldUseGlobalActiveCount() {
        // Mock Security Context for Admin
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("admin@example.com");

        User adminUser = new User();
        adminUser.setId(1L);
        adminUser.setRole(Role.ADMIN);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));

        // Mock Aggregated Stats (which might return incorrect student count)
        DashboardStats mockStats = new DashboardStats(100, 5000L, 1000L, 2000L, 500L); // 100 students from sessions
        when(sessionRecordRepository.getFinanceSummary(anyString())).thenReturn(mockStats);
        
        // Mock Active Student Count (The correct value we expect)
        when(studentRepository.countByActiveTrue()).thenReturn(42L);
        when(sessionRecordRepository.findAllMonthlyStatsAggregated()).thenReturn(new ArrayList<>());
        when(studentRepository.countByCreatedAtBetween(any(), any())).thenReturn(5L);

        // Execute
        DashboardStats result = dashboardService.getDashboardStats("2024-02");

        // Verify
        assertEquals(42, result.getTotalStudents()); // Must use the active count (42) not session count (100)
        verify(studentRepository).countByActiveTrue();
        verify(studentRepository, never()).countByTutorIdAndActiveTrue(any());
    }

    @Test
    void testGetDashboardStats_ForTutor_ShouldUseTutorActiveCount() {
        // Mock Security Context for Tutor
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("tutor@example.com");

        User tutorUser = new User();
        tutorUser.setId(2L);
        tutorUser.setRole(Role.TUTOR);
        when(userRepository.findByEmail("tutor@example.com")).thenReturn(Optional.of(tutorUser));

        Tutor tutor = new Tutor();
        tutor.setId(10L);
        when(tutorRepository.findByUserId(2L)).thenReturn(Optional.of(tutor));

        // Mock Aggregated Stats
        DashboardStats mockStats = new DashboardStats(50, 2000L, 500L, 1000L, 0L);
        when(sessionRecordRepository.getFinanceSummaryByTutorId(anyString(), eq(10L))).thenReturn(mockStats);

        // Mock Active Student Count
        when(studentRepository.countByTutorIdAndActiveTrue(10L)).thenReturn(7L);
        when(sessionRecordRepository.findMonthlyStatsAggregatedByTutorId(10L)).thenReturn(new ArrayList<>());
        when(studentRepository.countByCreatedAtBetweenAndTutorId(any(), any(), eq(10L))).thenReturn(2L);

        // Execute
        DashboardStats result = dashboardService.getDashboardStats("2024-02");

        // Verify
        assertEquals(7, result.getTotalStudents());
        verify(studentRepository).countByTutorIdAndActiveTrue(10L);
        verify(studentRepository, never()).countByActiveTrue();
    }
}
