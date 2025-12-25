// =========================================================================
// FILE 8: RefreshTokenRepository.java (No changes needed)
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================

package com.tutor_management.backend.modules.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);
    void deleteByUser(User user);
}
