package com.tutor_management.backend.exception;

import com.tutor_management.backend.modules.onlinesession.exception.InvalidTokenException;
import com.tutor_management.backend.modules.onlinesession.exception.RoomAccessDeniedException;
import com.tutor_management.backend.modules.onlinesession.exception.RoomAlreadyEndedException;
import com.tutor_management.backend.modules.onlinesession.exception.RoomNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
@ContextConfiguration(classes = {
        GlobalExceptionHandler.class,
        GlobalExceptionHandlerTest.TestController.class,
        GlobalExceptionHandlerTest.TestSecurityConfig.class // ✅ Add security config
})
@DisplayName("GlobalExceptionHandler Integration Tests")
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should return 404 for RoomNotFoundException")
    void handleRoomNotFoundException_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/test/room-not-found")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Room not found"));
    }

    @Test
    @DisplayName("Should return 403 for RoomAccessDeniedException")
    void handleRoomAccessDeniedException_ShouldReturn403() throws Exception {
        mockMvc.perform(get("/test/room-access-denied")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    @DisplayName("Should return 410 for RoomAlreadyEndedException")
    void handleRoomAlreadyEndedException_ShouldReturn410() throws Exception {
        mockMvc.perform(get("/test/room-already-ended")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isGone())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Room already ended"));
    }

    @Test
    @DisplayName("Should return 401 for InvalidTokenException")
    void handleInvalidTokenException_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/test/invalid-token")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid token"));
    }

    // ✅ ADD TEST SECURITY CONFIG
    @Configuration
    @EnableWebSecurity
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth
                            .anyRequest().permitAll() // ✅ Allow all requests in tests
                    );
            return http.build();
        }
    }

    @RestController
    static class TestController {
        @GetMapping("/test/room-not-found")
        void throwRoomNotFound() {
            throw new RoomNotFoundException("Room not found");
        }

        @GetMapping("/test/room-access-denied")
        void throwRoomAccessDenied() {
            throw new RoomAccessDeniedException("Access denied");
        }

        @GetMapping("/test/room-already-ended")
        void throwRoomAlreadyEnded() {
            throw new RoomAlreadyEndedException("Room already ended");
        }

        @GetMapping("/test/invalid-token")
        void throwInvalidToken() {
            throw new InvalidTokenException("Invalid token");
        }
    }
}