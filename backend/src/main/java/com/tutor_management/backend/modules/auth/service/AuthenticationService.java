package com.tutor_management.backend.modules.auth.service;

import com.tutor_management.backend.modules.auth.dto.request.LoginRequest;
import com.tutor_management.backend.modules.auth.dto.request.RegisterRequest;
import com.tutor_management.backend.modules.auth.dto.response.AuthResponse;
import com.tutor_management.backend.modules.auth.RefreshToken;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final com.tutor_management.backend.modules.tutor.service.TutorService tutorService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .enabled(true)
                .accountNonLocked(true)
                .build();

        User savedUser = userRepository.save(user);

        // ✅ CRITICAL: Auto-provision Tutor profile
        tutorService.ensureTutorProfile(savedUser);

        // Generate tokens
        String accessToken = jwtService.generateToken(savedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        return buildAuthResponse(savedUser, accessToken, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate user
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Get user
        User user = (User) authentication.getPrincipal();

        // ✅ Ensure profile exists on every login (idempotent)
        tutorService.ensureTutorProfile(user);

        // 3. Generate tokens
        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return buildAuthResponse(user, accessToken, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        return refreshTokenService.findByToken(refreshTokenStr)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    return buildAuthResponse(user, accessToken, refreshTokenStr);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
    }

    @Transactional
    public void logout(Long userId) {
        refreshTokenService.deleteByUserId(userId);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationTime())
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .avatarUrl(user.getAvatarUrl())
                        .studentId(user.getStudentId())
                        .build())
                .build();
    }
}

