package com.tutor_management.backend.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cache Configuration for improved performance
 * Reduces database queries for frequently accessed data
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
                "students",           // Cache student data
                "lessons",
                "homeworks",          // Cache homework data
                "sessions",           // Cache session records
                "documents",          // Cache documents
                "dashboard-stats",    // Cache dashboard statistics
                "recurring-schedules" // Cache recurring schedules
        );
    }
}