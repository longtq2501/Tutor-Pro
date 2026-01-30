package com.tutor_management.backend.modules.course.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import com.tutor_management.backend.modules.course.dto.request.UpdateVideoProgressRequest;
import com.tutor_management.backend.modules.course.dto.response.CourseNavigationResponse;
import com.tutor_management.backend.modules.course.dto.response.LessonProgressResponse;
import com.tutor_management.backend.modules.course.entity.Course;
import com.tutor_management.backend.modules.course.entity.CourseLesson;
import com.tutor_management.backend.modules.course.entity.LessonProgress;
import com.tutor_management.backend.modules.course.enums.LearningStatus;
import com.tutor_management.backend.modules.course.repository.CourseLessonRepository;
import com.tutor_management.backend.modules.course.repository.LessonProgressRepository;
import com.tutor_management.backend.modules.lesson.entity.Lesson;
import com.tutor_management.backend.modules.lesson.repository.LessonRepository;
import com.tutor_management.backend.modules.student.entity.Student;
import com.tutor_management.backend.modules.student.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LessonProgressServiceTest {

    @Mock
    private LessonProgressRepository progressRepository;
    @Mock
    private CourseLessonRepository courseLessonRepository;
    @Mock
    private LessonRepository lessonRepository;
    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private LessonProgressService lessonProgressService;

    private Student student;
    private Lesson lesson;
    private Course course;
    private CourseLesson courseLesson;
    private LessonProgress progress;

    @BeforeEach
    void setUp() {
        student = Student.builder().id(1L).build();
        lesson = Lesson.builder().id(1L).title("Test Lesson").build();
        course = Course.builder().id(1L).title("Test Course").build();
        courseLesson = CourseLesson.builder().course(course).lesson(lesson).lessonOrder(1).build();
        progress = LessonProgress.builder()
                .student(student)
                .lesson(lesson)
                .videoProgress(0)
                .learningStatus(LearningStatus.NOT_STARTED)
                .build();
    }

    @Test
    @DisplayName("Should update video progress and transition status")
    void updateVideoProgress() {
        UpdateVideoProgressRequest request = new UpdateVideoProgressRequest();
        request.setProgress(75);

        when(progressRepository.findByStudentIdAndLessonId(1L, 1L)).thenReturn(Optional.of(progress));
        when(progressRepository.save(any(LessonProgress.class))).thenAnswer(i -> i.getArguments()[0]);

        LessonProgressResponse response = lessonProgressService.updateVideoProgress(1L, 1L, request);

        assertEquals(75, response.getVideoProgress());
        assertEquals("Gần hoàn thành", response.getLearningStatus());
        assertTrue(response.getCanUnlockNext());
        verify(progressRepository).save(any(LessonProgress.class));
    }

    @Test
    @DisplayName("Should mark as completed at 100% progress")
    void markCompletedAtFullProgress() {
        UpdateVideoProgressRequest request = new UpdateVideoProgressRequest();
        request.setProgress(100);

        when(progressRepository.findByStudentIdAndLessonId(1L, 1L)).thenReturn(Optional.of(progress));
        when(progressRepository.save(any(LessonProgress.class))).thenAnswer(i -> i.getArguments()[0]);

        LessonProgressResponse response = lessonProgressService.updateVideoProgress(1L, 1L, request);

        assertEquals(100, response.getVideoProgress());
        assertEquals("Đã hoàn thành", response.getLearningStatus());
        assertTrue(response.getIsCompleted());
    }

    @Test
    @DisplayName("Should correctly identify locked next lesson")
    void getCourseNavigationLocked() {
        progress.setVideoProgress(50); // Under 70 threshold

        when(courseLessonRepository.findByCourseIdAndLessonId(1L, 1L)).thenReturn(Optional.of(courseLesson));
        when(progressRepository.findByStudentIdAndLessonId(1L, 1L)).thenReturn(Optional.of(progress));
        
        Lesson nextLesson = Lesson.builder().id(2L).title("Next Lesson").build();
        CourseLesson nextCourseLesson = CourseLesson.builder().lesson(nextLesson).lessonOrder(2).build();
        when(courseLessonRepository.findNextLesson(1L, 1)).thenReturn(Optional.of(nextCourseLesson));

        CourseNavigationResponse response = lessonProgressService.getCourseNavigation(1L, 1L, 1L);

        assertFalse(response.getCanNavigateNext());
        assertNotNull(response.getNextLessonLockedReason());
    }

    @Test
    @DisplayName("Should unlock next lesson when progress hits threshold")
    void getCourseNavigationUnlocked() {
        progress.setVideoProgress(70); // At 70 threshold

        when(courseLessonRepository.findByCourseIdAndLessonId(1L, 1L)).thenReturn(Optional.of(courseLesson));
        when(progressRepository.findByStudentIdAndLessonId(1L, 1L)).thenReturn(Optional.of(progress));
        
        Lesson nextLesson = Lesson.builder().id(2L).title("Next Lesson").build();
        CourseLesson nextCourseLesson = CourseLesson.builder().lesson(nextLesson).lessonOrder(2).build();
        when(courseLessonRepository.findNextLesson(1L, 1)).thenReturn(Optional.of(nextCourseLesson));

        CourseNavigationResponse response = lessonProgressService.getCourseNavigation(1L, 1L, 1L);

        assertTrue(response.getCanNavigateNext());
        assertNull(response.getNextLessonLockedReason());
    }
}
