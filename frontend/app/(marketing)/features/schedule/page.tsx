import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFeatureBySlug } from '@/features/landing/config/features';
import { FeaturePageLayout } from '@/features/landing/components/feature-detail/FeaturePageLayout';

const SLUG = 'schedule';

export function generateMetadata(): Metadata {
    const feature = getFeatureBySlug(SLUG);
    if (!feature) return {};

    return {
        title: `${feature.name} — Tính năng Tutor Pro`,
        description: feature.desc,
        openGraph: {
            title: `${feature.name} — Tính năng Tutor Pro`,
            description: feature.desc,
        },
    };
}

export default function ScheduleFeaturePage() {
    const feature = getFeatureBySlug(SLUG);
    if (!feature) notFound();

    return <FeaturePageLayout feature={feature} />;
}
