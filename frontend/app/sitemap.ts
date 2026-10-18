import { MetadataRoute } from 'next';
import { FEATURES } from '@/features/landing/config/features';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tutorpro.id.vn';
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/features`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    const featurePages: MetadataRoute.Sitemap = FEATURES.map((f) => ({
        url: `${baseUrl}/features/${f.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [...staticPages, ...featurePages];
}