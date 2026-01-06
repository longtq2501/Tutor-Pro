package com.tutor_management.backend.config;

import java.util.concurrent.TimeUnit;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.github.benmanes.caffeine.cache.Caffeine;

import lombok.extern.slf4j.Slf4j;

/**
 * Cache Configuration for Performance Optimization.
 * 
 * Upgraded from ConcurrentMapCacheManager to Caffeine for:
 * - TTL (Time-To-Live) support
 * - Maximum size limits
 * - Cache statistics
 * 
 * Cache regions:
 * - dashboardStats: 2 min TTL, for dashboard financial data
 * - monthlyStats: 5 min TTL, for monthly aggregations
 * - courseList: 5 min TTL, for course listings
 * - courseDetail: 5 min TTL, for individual course details
 * - students, lessons, documents: 5 min TTL
 */
@Configuration
@EnableCaching
@Slf4j
public class CacheConfig {

    @Bean
    @Primary
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        // Default cache configuration: 5 min TTL, max 500 entries
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .initialCapacity(100)
                .maximumSize(500)
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .recordStats());
        
        // Register all cache names
        cacheManager.setCacheNames(java.util.List.of(
                // New performance-critical caches
                "dashboardStats",
                "monthlyStats", 
                "courseList",
                "courseDetail",
                "users", // ✅ NEW: Cache for UserDetails
                // Existing caches (kept for compatibility)
                "students",
                "lessons",
                "homeworks",
                "sessions",
                "documents",
                "dashboard-stats",
                "recurring-schedules"
        ));
        
        log.info("✅ Caffeine Cache initialized with TTL support (5 min default)");
        return cacheManager;
    }
}
