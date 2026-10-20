import { describe, it, expect } from 'vitest';
import {
    FEATURES,
    FEATURE_GROUPS,
    FEATURE_GROUP_ORDER,
    getAllFeatures,
    getFeatureBySlug,
    getFeaturesByGroup,
    getRelatedFeatures,
} from '../config/features';

describe('Landing Features Configuration', () => {
    it('should have exactly 10 features configured', () => {
        expect(FEATURES).toHaveLength(10);
        expect(getAllFeatures()).toHaveLength(10);
    });

    it('should have unique slugs for all features', () => {
        const slugs = FEATURES.map((f) => f.slug);
        const uniqueSlugs = new Set(slugs);
        expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should match the planned 10 slugs', () => {
        const expectedSlugs = [
            'overview',
            'finance',
            'settings',
            'students',
            'classes',
            'schedule',
            'documents',
            'lessons',
            'reports',
            'exams',
        ];

        const actualSlugs = FEATURES.map((f) => f.slug);
        expect(actualSlugs).toEqual(expect.arrayContaining(expectedSlugs));
    });

    it('should assign every feature to a valid group', () => {
        const validGroupKeys = Object.keys(FEATURE_GROUPS);

        FEATURES.forEach((feature) => {
            expect(validGroupKeys).toContain(feature.group);
            expect(feature.name).toBeTruthy();
            expect(feature.tagline).toBeTruthy();
            expect(feature.desc).toBeTruthy();
            expect(feature.icon).toBeDefined();
            expect(feature.systemMeaning).toBeTruthy();
            expect(feature.keyBenefits.length).toBeGreaterThan(0);
        });
    });

    it('should retrieve a feature by slug correctly', () => {
        const schedule = getFeatureBySlug('schedule');
        expect(schedule).toBeDefined();
        expect(schedule?.name).toBe('Lịch dạy');
        expect(schedule?.group).toBe('teaching');
        expect(schedule?.type).toBe('action');

        const nonExistent = getFeatureBySlug('non-existent-feature');
        expect(nonExistent).toBeUndefined();
    });

    it('should filter features by group correctly', () => {
        const operationsFeatures = getFeaturesByGroup('operations');
        expect(operationsFeatures.map((f) => f.slug)).toEqual(
            expect.arrayContaining(['overview', 'finance', 'settings'])
        );

        const teachingFeatures = getFeaturesByGroup('teaching');
        expect(teachingFeatures.map((f) => f.slug)).toEqual(
            expect.arrayContaining(['schedule', 'documents', 'lessons'])
        );
    });

    it('should only reference valid slugs in related features', () => {
        const allSlugs = FEATURES.map((f) => f.slug);

        FEATURES.forEach((feature) => {
            feature.related.forEach((relSlug) => {
                expect(allSlugs).toContain(relSlug);
            });

            const resolvedRelated = getRelatedFeatures(feature.slug);
            expect(resolvedRelated).toHaveLength(feature.related.length);
        });
    });

    it('should expose the group order Vận hành → Học vụ → Giảng dạy → Đánh giá', () => {
        expect(FEATURE_GROUP_ORDER).toEqual(['operations', 'academics', 'teaching', 'assessment']);
        expect(FEATURE_GROUP_ORDER.map((key) => FEATURE_GROUPS[key].label)).toEqual([
            'Vận hành',
            'Học vụ',
            'Giảng dạy',
            'Đánh giá',
        ]);
        // Mọi nhóm đều có mặt trong thứ tự hiển thị, không thiếu không thừa
        expect([...FEATURE_GROUP_ORDER].sort()).toEqual(Object.keys(FEATURE_GROUPS).sort());
    });

    it('should keep dropdown descriptions short enough to read fully in 2 lines', () => {
        FEATURES.forEach((feature) => {
            expect(feature.desc.length).toBeLessThanOrEqual(60);
            expect(feature.desc).not.toMatch(/\.\.\.|…$/);
        });
    });
});
