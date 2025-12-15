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
//    List<Student> findByUserIdOrderByCreatedAtDesc(Long userId);
//    Optional<Student> findByIdAndUserId(Long id, Long userId);

    List<Student> findAllByOrderByCreatedAtDesc();

    List<Student> findByActiveTrue();

    // THÊM QUERY NÀY để fetch parent cùng lúc
    // Fetch single student with parent
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.id = :id")
    Optional<Student> findByIdWithParent(@Param("id") Long id);

    // Fetch multiple students with parent
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.id IN :ids")
    List<Student> findByIdInWithParent(@Param("ids") List<Long> ids);

    // Fetch all active students with parent
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.parent WHERE s.active = true")
    List<Student> findByActiveTrueWithParent();
}
