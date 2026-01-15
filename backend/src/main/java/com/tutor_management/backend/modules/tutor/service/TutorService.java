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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing Tutor entities.
 */
@Service
@RequiredArgsConstructor
public class TutorService {

    private final TutorRepository tutorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.tutor_management.backend.modules.student.repository.StudentRepository studentRepository;
    private final com.tutor_management.backend.modules.finance.repository.SessionRecordRepository sessionRecordRepository;

    /**
     * Get all tutors with pagination and filtering.
     * @param search Search term (name or email).
     * @param status Subscription status filter (optional).
     * @param pageable Pagination info.
     * @return Page of TutorResponse.
     */
    @Transactional(readOnly = true)
    public Page<TutorResponse> getAllTutors(String search, String status, Pageable pageable) {
        Page<Tutor> tutors;
        
        if (search != null && !search.isBlank() && status != null && !status.isBlank()) {
            // Both filters
            tutors = tutorRepository.searchByNameOrEmailAndStatus(search, status, pageable);
        } else if (search != null && !search.isBlank()) {
            // Search only
            tutors = tutorRepository.searchByNameOrEmail(search, pageable);
        } else if (status != null && !status.isBlank()) {
            // Status only
            tutors = tutorRepository.findBySubscriptionStatus(status, pageable);
        } else {
            // No filters
            tutors = tutorRepository.findAll(pageable);
        }
        
        return tutors.map(this::mapToResponse);
    }

    /**
     * Get tutor by specific ID.
     * @param id Tutor ID.
     * @return TutorResponse.
     */
    @Transactional(readOnly = true)
    public TutorResponse getTutorById(Long id) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutor not found with id: " + id));
        return mapToResponse(tutor);
    }

    /**
     * Create a new tutor.
     * @param request Tutor creation request.
     * @return Created TutorResponse.
     */
    @Transactional
    public TutorResponse createTutor(TutorRequest request) {
        // 1. Validation: Check if Tutor email exists
        if (tutorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AlreadyExistsException("Tutor with this email already exists: " + request.getEmail());
        }

        User user;

        // 2. Logic: If userId is provided, try to link to existing User
        // When linking existing user, verify email matches
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new TutorNotFoundException(request.getUserId()));

            // ADD: Verify emails match
            if (!user.getEmail().equals(request.getEmail())) {
                throw new IllegalArgumentException(
                        "User email doesn't match Tutor email. User: " + user.getEmail() +
                                ", Tutor: " + request.getEmail()
                );
            }

            if (tutorRepository.findByUserId(user.getId()).isPresent()) {
                throw new AlreadyExistsException("User already has a Tutor profile");
            }
        } else {
            // 3. Atomic Creation: Create new User if no ID provided
            if (request.getPassword() == null || request.getPassword().length() < 8) {
                throw new IllegalArgumentException(
                        "Password is required and must be at least 8 characters"
                );
            }

            // Check if User email exists (using same email as Tutor profile)
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

        // 4. Create Tutor linked to User
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
     * Update an existing tutor.
     * @param id Tutor ID.
     * @param request Update request.
     * @return Updated TutorResponse.
     */
    @Transactional
    public TutorResponse updateTutor(Long id, TutorRequest request) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new TutorNotFoundException(id));

        // Check email uniqueness (exclude current tutor)
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

    /**
     * Get statistics for a tutor.
     * @param id Tutor ID.
     * @return TutorStatsDTO.
     */
    @Transactional(readOnly = true)
    public TutorStatsDTO getTutorStats(Long id) {
        // Validation check
        if (!tutorRepository.existsById(id)) {
            throw new RuntimeException("Tutor not found with id: " + id);
        }

        // 1. Get active student count
        long studentCount = studentRepository.countByTutorIdAndActiveTrue(id);
        
        // 2. Get session count for current month
        String currentMonth = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("MM/yyyy"));
        Integer sessionCount = sessionRecordRepository.sumSessionsByMonthAndTutorId(currentMonth, id);
        
        // 3. Get total revenue (Using paid + unpaid for total value generated)
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
    
    /**
     * Delete a tutor.
     * @param id Tutor ID.
     */
    @Transactional
    public void deleteTutor(Long id) {
         if (!tutorRepository.existsById(id)) {
            throw new RuntimeException("Tutor not found with id: " + id);
        }
        tutorRepository.deleteById(id);
    }

    private TutorResponse mapToResponse(Tutor tutor) {
    // Defensive check (even though @EntityGraph should load it)
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
