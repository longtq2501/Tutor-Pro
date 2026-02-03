package com.tutor_management.backend.modules.document.service;

import com.tutor_management.backend.modules.document.entity.DocumentCategory;
import com.tutor_management.backend.modules.document.repository.DocumentCategoryRepository;
import com.tutor_management.backend.modules.shared.dto.response.CursorPageResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("DocumentCategoryService Unit Tests (Cursor Pagination)")
class DocumentCategoryServiceTest {

    @Mock
    private DocumentCategoryRepository categoryRepository;

    @InjectMocks
    private DocumentCategoryService categoryService;

    @Test
    @DisplayName("Should fetch first page when cursor is null")
    void getCategoriesCursor_FirstPage() {
        List<DocumentCategory> mockItems = IntStream.range(0, 11)
                .mapToObj(i -> DocumentCategory.builder()
                        .id((long) i)
                        .displayOrder(i)
                        .code("CAT" + i)
                        .name("Category " + i)
                        .build())
                .toList();

        when(categoryRepository.findCategoriesByCursor(eq(null), eq(null), any(Pageable.class)))
                .thenReturn(mockItems);

        CursorPageResponse<DocumentCategory> response = categoryService.getCategoriesCursor(null, 10);

        assertEquals(10, response.getItems().size());
        assertTrue(response.isHasNext());
        assertEquals("9:9", response.getNextCursor());
    }

    @Test
    @DisplayName("Should fetch next page using cursor")
    void getCategoriesCursor_NextPage() {
        List<DocumentCategory> mockItems = List.of(
                DocumentCategory.builder().id(11L).displayOrder(11).code("CAT11").name("Category 11").build()
        );

        when(categoryRepository.findCategoriesByCursor(eq(10), eq(10L), any(Pageable.class)))
                .thenReturn(mockItems);

        CursorPageResponse<DocumentCategory> response = categoryService.getCategoriesCursor("10:10", 10);

        assertEquals(1, response.getItems().size());
        assertFalse(response.isHasNext());
        assertNull(response.getNextCursor());
    }

    @Test
    @DisplayName("Should handle invalid cursor format gracefully")
    void getCategoriesCursor_InvalidCursor() {
        List<DocumentCategory> mockItems = List.of();
        when(categoryRepository.findCategoriesByCursor(eq(null), eq(null), any(Pageable.class)))
                .thenReturn(mockItems);

        CursorPageResponse<DocumentCategory> response = categoryService.getCategoriesCursor("invalid", 10);

        assertNotNull(response);
        assertEquals(0, response.getItems().size());
    }
}
