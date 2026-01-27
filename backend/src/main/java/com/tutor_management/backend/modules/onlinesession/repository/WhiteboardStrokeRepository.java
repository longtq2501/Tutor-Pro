package com.tutor_management.backend.modules.onlinesession.repository;

import com.tutor_management.backend.modules.onlinesession.entity.WhiteboardStroke;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WhiteboardStrokeRepository extends JpaRepository<WhiteboardStroke, Long> {
    
    List<WhiteboardStroke> findByRoomIdOrderByTimestampAsc(String roomId);
    
    Optional<WhiteboardStroke> findByRoomIdAndStrokeId(String roomId, String strokeId);
    
    void deleteByRoomIdAndStrokeId(String roomId, String strokeId);
    
    void deleteByRoomIdAndUserId(String roomId, String userId);
}
