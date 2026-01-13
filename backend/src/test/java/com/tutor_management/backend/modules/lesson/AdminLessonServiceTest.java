package com.tutor_management.backend.modules.lesson;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.lesson.dto.response.AdminLessonResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AdminLessonService focusing on N+1 query prevention.
 * Verifies that the optimized findByIdWithDetails() method is used correctly.
 */
@ExtendWith(MockitoExtension.class)
class AdminLessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private AdminLessonService adminLessonService;

    private Lesson testLesson;

    @BeforeEach
    void setUp() {
        testLesson = Lesson.builder()
                .id(1L)
                .tutorName("Thầy Quỳnh Long")
                .title("Test Lesson")
                .summary("Test Summary")
                .content("Test Content")
                .lessonDate(LocalDate.now())
                .isPublished(true)
                .isLibrary(true)
                .images(new ArrayList<>())
                .resources(new ArrayList<>())
                .build();
    }

    /**
     * Verifies that getLessonById uses the optimized query method.
     * This prevents N+1 queries by eagerly fetching collections.
     */
    @Test
    void testGetLessonById_UsesOptimizedQuery() {
        // Arrange
        when(lessonRepository.findByIdWithDetails(1L))
                .thenReturn(Optional.of(testLesson));

        // Act
        AdminLessonResponse response = adminLessonService.getLessonById(1L);

        // Assert
        assertNotNull(response);
        assertEquals("Test Lesson", response.getTitle());
        verify(lessonRepository, times(1)).findByIdWithDetails(1L);
        verify(lessonRepository, never()).findById(anyLong());
    }

    /**
     * Verifies proper exception handling when lesson is not found.
     */
    @Test
    void testGetLessonById_NotFound_ThrowsException() {
        // Arrange
        when(lessonRepository.findByIdWithDetails(999L))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            adminLessonService.getLessonById(999L);
        });
        verify(lessonRepository, times(1)).findByIdWithDetails(999L);
    }

    /**
     * Verifies that collections are properly initialized when present.
     */
    @Test
    void testGetLessonById_WithCollections_ReturnsCompleteData() {
        // Arrange
        LessonImage image = LessonImage.builder()
                .id(1L)
                .lesson(testLesson)
                .imageUrl("https://example.com/image.jpg")
                .caption("Test Image")
                .displayOrder(1)
                .build();
        testLesson.getImages().add(image);

        LessonResource resource = LessonResource.builder()
                .id(1L)
                .lesson(testLesson)
                .title("Test Resource")
                .resourceUrl("https://example.com/resource.pdf")
                .resourceType(LessonResource.ResourceType.PDF)
                .displayOrder(1)
                .build();
        testLesson.getResources().add(resource);

        when(lessonRepository.findByIdWithDetails(1L))
                .thenReturn(Optional.of(testLesson));

        // Act
        AdminLessonResponse response = adminLessonService.getLessonById(1L);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getImages());
        assertNotNull(response.getResources());
        assertEquals(1, response.getImages().size());
        assertEquals(1, response.getResources().size());
        verify(lessonRepository, times(1)).findByIdWithDetails(1L);
    }
}
