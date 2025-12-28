package com.tutor_management.backend.modules.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    List<LessonProgress> findByStudentId(Long studentId);

    Optional<LessonProgress> findByStudentIdAndLessonId(Long studentId, Long lessonId);

    boolean existsByStudentIdAndLessonId(Long studentId, Long lessonId);
}
