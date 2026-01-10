package com.tutor_management.backend.modules.student;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for {@link Student} management.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Retrieves all students ordered by creation date descending.
     */
    List<Student> findAllByOrderByCreatedAtDesc();

    /**
     * Retrieves a student by ID with their associated parent eagerly fetched.
     */
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.id = :id")
    Optional<Student> findByIdWithParent(@Param("id") Long id);

    /**
     * Retrieves students by IDs with their associated parents eagerly fetched.
     */
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.id IN :ids")
    List<Student> findByIdInWithParent(@Param("ids") List<Long> ids);

    /**
     * Retrieves all active students with their associated parents eagerly fetched.
     */
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.active = true")
    List<Student> findByActiveTrueWithParent();

    /**
     * Retrieves the complete student registry with parents eagerly fetched to avoid N+1 queries.
     */
    @Query("SELECT DISTINCT s FROM Student s " +
            "LEFT JOIN FETCH s.parent " +
            "ORDER BY s.createdAt DESC")
    List<Student> findAllWithParentOrderByCreatedAtDesc();

    /**
     * Counts the number of students enrolled within a specific time frame.
     */
    @Query("SELECT COUNT(s) FROM Student s WHERE s.createdAt >= :start AND s.createdAt <= :end")
    long countByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
