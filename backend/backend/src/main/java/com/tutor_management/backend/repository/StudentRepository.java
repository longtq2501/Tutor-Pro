// =========================================================================
// FILE 3: StudentRepository.java (ALREADY OPTIMIZED - kept as is)
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================

package com.tutor_management.backend.repository;

import com.tutor_management.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findAllByOrderByCreatedAtDesc();

    List<Student> findByActiveTrue();

    // ✅ Already optimized with JOIN FETCH
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.id = :id")
    Optional<Student> findByIdWithParent(@Param("id") Long id);

    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.id IN :ids")
    List<Student> findByIdInWithParent(@Param("ids") List<Long> ids);

    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.active = true")
    List<Student> findByActiveTrueWithParent();

    // ✅ ADD: Get all with parent
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent ORDER BY s.createdAt DESC")
    List<Student> findAllWithParentOrderByCreatedAtDesc();
}