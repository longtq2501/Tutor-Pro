// =========================================================================
// FILE 3: StudentRepository.java (ALREADY OPTIMIZED - kept as is)
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================
package com.tutor_management.backend.modules.student;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findAllByOrderByCreatedAtDesc();

    // ✅ Already optimized with JOIN FETCH
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.id = :id")
    Optional<Student> findByIdWithParent(@Param("id") Long id);

    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.id IN :ids")
    List<Student> findByIdInWithParent(@Param("ids") List<Long> ids);

    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.active = true")
    List<Student> findByActiveTrueWithParent();

    // ✅ OPTIMIZED: Load all students with parent in one query
    @Query("SELECT DISTINCT s FROM Student s " +
            "LEFT JOIN FETCH s.parent " +
            "ORDER BY s.createdAt DESC")
    List<Student> findAllWithParentOrderByCreatedAtDesc();
}
