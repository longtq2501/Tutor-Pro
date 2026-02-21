package com.tutor_management.backend.modules.auth;

import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.shared.service.CloudinaryService;
import com.tutor_management.backend.modules.auth.dto.request.UpdateUserRequest;
import com.tutor_management.backend.modules.auth.dto.response.AuthResponse;
import com.tutor_management.backend.modules.auth.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private UserService userService;

    @Mock
    private MultipartFile multipartFile;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController userController;

    private User user;
    private AuthResponse.UserInfo userInfo;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .build();
        
        userInfo = AuthResponse.UserInfo.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .build();
    }

    @Test
    void getCurrentUser_ShouldReturnUserInfo() {
        // Given
        when(authentication.getPrincipal()).thenReturn(user);
        when(userService.getUserProfile(1L)).thenReturn(userInfo);

        // When
        ResponseEntity<ApiResponse<AuthResponse.UserInfo>> response = userController.getCurrentUser(authentication);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userInfo, response.getBody().getData());
    }

    @Test
    void updateProfile_ShouldUpdateAndReturnUserInfo() {
        // Given
        UpdateUserRequest request = UpdateUserRequest.builder().fullName("Updated Name").build();
        AuthResponse.UserInfo updatedInfo = AuthResponse.UserInfo.builder()
                .id(1L)
                .fullName("Updated Name")
                .build();
        
        when(authentication.getPrincipal()).thenReturn(user);
        when(userService.updateUserProfile(1L, request)).thenReturn(updatedInfo);

        // When
        ResponseEntity<ApiResponse<AuthResponse.UserInfo>> response = userController.updateProfile(request, authentication);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedInfo, response.getBody().getData());
        assertEquals("Profile updated successfully", response.getBody().getMessage());
    }

    @Test
    void updateAvatar_ShouldUploadAndSave() throws IOException {
        // Given
        when(authentication.getPrincipal()).thenReturn(user);
        when(cloudinaryService.uploadFile(any())).thenReturn("http://cloudinary.com/avatar.jpg");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // When
        ResponseEntity<ApiResponse<String>> response = userController.updateAvatar(multipartFile, authentication);

        // Then
        verify(cloudinaryService).uploadFile(multipartFile);
        verify(userRepository).save(any(User.class));
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("http://cloudinary.com/avatar.jpg", response.getBody().getData());
        assertEquals("Avatar updated successfully", response.getBody().getMessage());
    }
}
