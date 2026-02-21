package com.tutor_management.backend.modules.tutor.service;

import com.tutor_management.backend.exception.AlreadyExistsException;
import com.tutor_management.backend.exception.EmailNotFoundException;
import com.tutor_management.backend.exception.TutorNotFoundException;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.tutor.dto.TutorStatsDTO;
import com.tutor_management.backend.modules.tutor.dto.request.TutorRequest;
import com.tutor_management.backend.modules.tutor.dto.response.TutorResponse;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.tutor.repository.TutorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for managing Tutor entities.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TutorService {

    private final TutorRepository tutorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.tutor_management.backend.modules.student.repository.StudentRepository studentRepository;
    private final com.tutor_management.backend.modules.finance.repository.SessionRecordRepository sessionRecordRepository;

    /**
     * Get all tutors with pagination and filtering.
     */
    @Transactional(readOnly = true)
    public Page<TutorResponse> getAllTutors(String search, String status, Pageable pageable) {
        Page<Tutor> tutors;
        
        if (search != null && !search.isBlank() && status != null && !status.isBlank()) {
            tutors = tutorRepository.searchByNameOrEmailAndStatus(search, status, pageable);
        } else if (search != null && !search.isBlank()) {
            tutors = tutorRepository.searchByNameOrEmail(search, pageable);
        } else if (status != null && !status.isBlank()) {
            tutors = tutorRepository.findBySubscriptionStatus(status, pageable);
        } else {
            tutors = tutorRepository.findAll(pageable);
        }
        
        return tutors.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public TutorResponse getTutorById(Long id) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutor not found with id: " + id));
        return mapToResponse(tutor);
    }

    /**
     * Create a new tutor.
     */
    @Transactional
    public TutorResponse createTutor(TutorRequest request) {
        if (tutorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AlreadyExistsException("Tutor with this email already exists: " + request.getEmail());
        }

        User user;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new TutorNotFoundException(request.getUserId()));

            if (!user.getEmail().equals(request.getEmail())) {
                throw new IllegalArgumentException("User email doesn't match Tutor email.");
            }

            if (tutorRepository.findByUserId(user.getId()).isPresent()) {
                throw new AlreadyExistsException("User already has a Tutor profile");
            }
        } else {
            if (request.getPassword() == null || request.getPassword().length() < 8) {
                throw new IllegalArgumentException("Password must be at least 8 characters");
            }

            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                 throw new AlreadyExistsException("User account with this email already exists: " + request.getEmail());
            }

            user = User.builder()
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(com.tutor_management.backend.modules.auth.Role.TUTOR)
                    .enabled(true)
                    .accountNonLocked(true)
                    .build();
            
            user = userRepository.save(user);
        }

        Tutor tutor = Tutor.builder()
                .user(user)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subscriptionPlan(request.getSubscriptionPlan())
                .subscriptionStatus(request.getSubscriptionStatus() != null ? request.getSubscriptionStatus() : "ACTIVE")
                .build();

        return mapToResponse(tutorRepository.save(tutor));
    }

    /**
     * Ensures a Tutor profile exists for the given User.
     * Used during authentication to auto-provision profiles.
     */
    @Transactional
    public void ensureTutorProfile(User user) {
        if (user == null || !com.tutor_management.backend.modules.auth.Role.TUTOR.equals(user.getRole())) {
            return;
        }

        if (tutorRepository.findByUserId(user.getId()).isPresent()) {
            return;
        }

        Optional<Tutor> existingTutor = tutorRepository.findByEmail(user.getEmail());
        if (existingTutor.isPresent()) {
            Tutor tutor = existingTutor.get();
            if (tutor.getUser() == null || !tutor.getUser().getId().equals(user.getId())) {
                log.info("Linking existing Tutor profile ({}) to User account ({})", user.getEmail(), user.getId());
                tutor.setUser(user);
                tutorRepository.save(tutor);
            }
            return;
        }

        Tutor tutor = Tutor.builder()
                .user(user)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone("N/A")
                .subscriptionPlan("SOLO")
                .subscriptionStatus("ACTIVE")
                .build();
        
        tutorRepository.save(tutor);
        log.info("Created automatic Tutor profile for user: {}", user.getEmail());
    }

    @Transactional
    public TutorResponse updateTutor(Long id, TutorRequest request) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new TutorNotFoundException(id));

        if (!tutor.getEmail().equals(request.getEmail())) {
            tutorRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new EmailNotFoundException("Email already exists: " + request.getEmail());
                }
            });
        }

        tutor.setFullName(request.getFullName());
        tutor.setEmail(request.getEmail());
        tutor.setPhone(request.getPhone());
        tutor.setSubscriptionPlan(request.getSubscriptionPlan());

        if (request.getSubscriptionStatus() != null) {
            tutor.setSubscriptionStatus(request.getSubscriptionStatus());
        }

        return mapToResponse(tutorRepository.save(tutor));
    }

    @Transactional(readOnly = true)
    public TutorStatsDTO getTutorStats(Long id) {
        if (!tutorRepository.existsById(id)) {
            throw new RuntimeException("Tutor not found with id: " + id);
        }

        long studentCount = studentRepository.countByTutorIdAndActiveTrue(id);
        String currentMonth = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("MM/yyyy"));
        Integer sessionCount = sessionRecordRepository.sumSessionsByMonthAndTutorId(currentMonth, id);
        
        com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats financeStats = 
                sessionRecordRepository.getFinanceSummaryByTutorId(currentMonth, id);
        
        double totalRevenue = 0.0;
        if (financeStats != null) {
            long paid = financeStats.getTotalPaidRaw() != null ? financeStats.getTotalPaidRaw() : 0L;
            long unpaid = financeStats.getTotalUnpaidRaw() != null ? financeStats.getTotalUnpaidRaw() : 0L;
            totalRevenue = (double) (paid + unpaid);
        }

        return TutorStatsDTO.builder()
                .studentCount((int) studentCount)
                .sessionCount(sessionCount != null ? sessionCount : 0)
                .totalRevenue(totalRevenue)
                .build();
    }
    
    @Transactional
    public void deleteTutor(Long id) {
         if (!tutorRepository.existsById(id)) {
            throw new RuntimeException("Tutor not found with id: " + id);
        }
        tutorRepository.deleteById(id);
    }

    private TutorResponse mapToResponse(Tutor tutor) {
        if (tutor.getUser() == null) {
            throw new IllegalStateException("Tutor.user not loaded for id: " + tutor.getId());
        }
        
        return TutorResponse.builder()
                .id(tutor.getId())
                .userId(tutor.getUser().getId())
                .fullName(tutor.getFullName())
                .email(tutor.getEmail())
                .phone(tutor.getPhone())
                .subscriptionPlan(tutor.getSubscriptionPlan())
                .subscriptionStatus(tutor.getSubscriptionStatus())
                .createdAt(tutor.getCreatedAt())
                .updatedAt(tutor.getUpdatedAt())
                .build();
    }
}
