package com.tutor_management.backend.modules.onlinesession.service;

import com.tutor_management.backend.modules.onlinesession.dto.request.WhiteboardStrokeMessage;
import java.util.List;

public interface WhiteboardService {
    void saveStroke(String roomId, WhiteboardStrokeMessage.StrokeData stroke);
    List<WhiteboardStrokeMessage.StrokeData> getStrokes(String roomId);
    void deleteStroke(String roomId, String strokeId);
    void clearStrokes(String roomId, String userId);
}
