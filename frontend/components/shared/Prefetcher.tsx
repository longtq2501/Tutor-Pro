'use client';

import { useEffect } from 'react';
import { sessionsApi } from '@/lib/services';

export function Prefetcher() {
    useEffect(() => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        // Silent prefetch into browser cache/CDN
        sessionsApi.getByMonth(currentMonth).catch(() => { });
    }, []);

    return null;
}
