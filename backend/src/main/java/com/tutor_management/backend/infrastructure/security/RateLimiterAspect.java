package com.tutor_management.backend.infrastructure.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.tutor_management.backend.exception.TooManyRequestsException;
import com.tutor_management.backend.modules.auth.User;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Aspect to enforce rate limiting on methods marked with @RateLimiter.
 * Uses Caffeine Cache for efficient in-memory tracking.
 */
@Aspect
@Component
@Slf4j
public class RateLimiterAspect {

    // Store caches per method to allow different limits/periods
    private final ConcurrentHashMap<String, Cache<Long, AtomicInteger>> caches = new ConcurrentHashMap<>();

    @Before("@annotation(rateLimiter)")
    public void limit(JoinPoint joinPoint, RateLimiter rateLimiter) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            // If not authenticated, we could limit by IP, but for this specific 
            // requirement (Tutor session creation), they must be authenticated.
            return;
        }

        Long userId = user.getId();
        String methodKey = getMethodKey(joinPoint);
        
        Cache<Long, AtomicInteger> cache = caches.computeIfAbsent(methodKey, k -> 
            Caffeine.newBuilder()
                .expireAfterWrite(rateLimiter.period(), TimeUnit.SECONDS)
                .build()
        );

        AtomicInteger count = cache.get(userId, k -> new AtomicInteger(0));
        
        if (count.incrementAndGet() > rateLimiter.limit()) {
            log.warn("Rate limit exceeded for user: {} on method: {}. Limit: {}/{}s", 
                userId, methodKey, rateLimiter.limit(), rateLimiter.period());
            throw new TooManyRequestsException("Tốc độ tạo phòng quá nhanh. Vui lòng thử lại sau.");
        }
    }

    private String getMethodKey(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        return signature.toLongString();
    }
}
