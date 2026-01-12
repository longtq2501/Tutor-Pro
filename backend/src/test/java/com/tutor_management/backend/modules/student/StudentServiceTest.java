package com.tutor_management.backend.modules.student;

import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.parent.ParentRepository;
import com.tutor_management.backend.modules.student.dto.request.StudentRequest;
import com.tutor_management.backend.modules.student.dto.response.StudentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    @Mock
    private SessionRecordRepository sessionRecordRepository;
    @Mock
    private ParentRepository parentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentService studentService;

    private Student student;

    @BeforeEach
    void setUp() {
        student = Student.builder()
                .id(1L)
                .name("Test Student")
                .active(true)
                .pricePerHour(200000L)
                .build();
    }

    @Test
    void getStudentById_ShouldReturnStudent_WhenExists() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(sessionRecordRepository.findByStudentId(1L)).thenReturn(java.util.Collections.emptyList());
        when(userRepository.findByStudentId(1L)).thenReturn(java.util.Collections.emptyList());

        StudentResponse response = studentService.getStudentById(1L);

        assertNotNull(response);
        assertEquals("Test Student", response.getName());
        verify(studentRepository, times(1)).findById(1L);
    }

    @Test
    void createStudent_ShouldSaveStudent() {
        StudentRequest request = new StudentRequest();
        request.setName("New Student");
        request.setPricePerHour(150000L);
        request.setActive(true);

        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentResponse response = studentService.createStudent(request);

        assertNotNull(response);
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void deleteStudent_ShouldCallRepositoryDelete() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        studentService.deleteStudent(1L);

        verify(studentRepository, times(1)).delete(any(Student.class));
        verify(sessionRecordRepository, times(1)).deleteAll(any());
    }
}
