package com.tutor_management.backend.modules.onlinesession.security;

import com.tutor_management.backend.modules.auth.Role;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.onlinesession.entity.OnlineSession;
import com.tutor_management.backend.modules.onlinesession.exception.RoomAccessDeniedException;
import com.tutor_management.backend.modules.onlinesession.exception.RoomNotFoundException;
import com.tutor_management.backend.modules.onlinesession.repository.OnlineSessionRepository;
import com.tutor_management.backend.modules.tutor.entity.Tutor;
import com.tutor_management.backend.modules.tutor.repository.TutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Objects;

/**
 * Validator for securing room access.
 * Ensures only authorized participants (Tutor, Student, or Admin) can enter a room.
 */
@Component
@RequiredArgsConstructor
public class RoomAccessValidator {

    private final OnlineSessionRepository onlineSessionRepository;
    private final UserRepository userRepository;
    private final TutorRepository tutorRepository;

    /**
     * Validates if a user has permission to access a specific room.
     * 
     * @param roomId The unique room identifier.
     * @param userId The ID of the user requesting access.
     * @throws RoomNotFoundException if the room does not exist.
     * @throws RoomAccessDeniedException if the user is not authorized.
     */
    public void validateAccess(String roomId, Long userId) {
        OnlineSession session = onlineSessionRepository.findByRoomId(roomId)
            .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        // ADMIN has global access
        if (user.getRole() == Role.ADMIN) {
            return;
        }

        // TUTOR must be the assigned tutor for this session
        if (user.getRole() == Role.TUTOR) {
            Tutor tutor = tutorRepository.findByUserId(userId)
                .orElseThrow(() -> new RoomAccessDeniedException("Tutor profile not found for user: " + userId));

            if (session.getTutor() == null) {
                throw new RoomAccessDeniedException("Session has no assigned tutor (data corruption).");
            }
            
            if (!Objects.equals(tutor.getId(), session.getTutor().getId())) {
                throw new RoomAccessDeniedException("You are not the designated tutor for this room.");
            }
            return;
        }

        // STUDENT must be the assigned student for this session
        if (user.getRole() == Role.STUDENT) {
            if (session.getStudent() == null) {
                throw new RoomAccessDeniedException("Session has no assigned student (data corruption).");
            }
            if (user.getStudentId() == null || !Objects.equals(user.getStudentId(), session.getStudent().getId())) {
                throw new RoomAccessDeniedException("You are not authorized to join this room.");
            }
            return;
        }

        // Fallback for any other unauthorized roles
        throw new RoomAccessDeniedException("Unauthorized role for room access.");
    }
}
