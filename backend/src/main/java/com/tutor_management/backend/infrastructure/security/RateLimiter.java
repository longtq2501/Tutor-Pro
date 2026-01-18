package com.tutor_management.backend.infrastructure.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods for rate limiting.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimiter {
    /**
     * Maximum number of requests allowed within the period.
     */
    int limit() default 10;

    /**
     * Period in seconds for the rate limit.
     * Default is 3600 seconds (1 hour).
     */
    int period() default 3600;
}
