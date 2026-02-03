package com.tutor_management.backend.modules.shared.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Generic response wrapper for cursor-based pagination.
 * Used for high-performance infinite scrolling.
 *
 * @param <T> The type of items in the page.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CursorPageResponse<T> {
    private List<T> items;
    private String nextCursor;
    private boolean hasNext;
}
