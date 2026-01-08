// =========================================================================
// FILE 7: UserRepository.java (No changes needed - simple queries)
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================

package com.tutor_management.backend.modules.auth;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    List<User> findByStudentId(Long studentId);

    // ✅ OPTIMIZED: Batch load users for multiple students
    List<User> findByStudentIdIn(List<Long> studentIds);
}
