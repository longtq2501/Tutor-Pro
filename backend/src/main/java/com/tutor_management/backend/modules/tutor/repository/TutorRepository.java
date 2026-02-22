package com.tutor_management.backend.modules.tutor.repository;

import com.tutor_management.backend.modules.tutor.entity.Tutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Tutor data access.
 */
@Repository
public interface TutorRepository extends JpaRepository<Tutor, Long> {

    /**
     * Finds a tutor by their associated User ID.
     * @param userId The ID of the User.
     * @return Optional containing the Tutor if found.
     */
    @EntityGraph(attributePaths = {"user"})
    Optional<Tutor> findByUserId(Long userId);

    /**
     * Finds a tutor by email.
     * @param email The email to search for.
     * @return Optional containing the Tutor if found.
     */
    Optional<Tutor> findByEmail(String email);

    /**
     * Search tutors by name or email with pagination.
     * @param search The search term.
     * @param pageable Pagination information.
     * @return Page of Tutors.
     */
    @Query("SELECT t FROM Tutor t WHERE " +
           "LOWER(t.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    @EntityGraph(attributePaths = {"user"})
    Page<Tutor> searchByNameOrEmail(@Param("search") String search, Pageable pageable);

    // Status filter only
    @EntityGraph(attributePaths = {"user"})
    Page<Tutor> findBySubscriptionStatus(String status, Pageable pageable);
    
    // Search + status combined
    @Query("SELECT t FROM Tutor t WHERE " +
           "(LOWER(t.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND t.subscriptionStatus = :status")
    @EntityGraph(attributePaths = {"user"})
    Page<Tutor> searchByNameOrEmailAndStatus(
        @Param("search") String search, 
        @Param("status") String status, 
        Pageable pageable
    );

    /**
     * Find all tutors with pagination and eager fetching of User.
     * @param pageable Pagination information.
     * @return Page of Tutors.
     */
    @Override
    @EntityGraph(attributePaths = {"user"})
    Page<Tutor> findAll(Pageable pageable);

    long countBySubscriptionStatus(String status);

    long countBySubscriptionPlan(String plan);
}
