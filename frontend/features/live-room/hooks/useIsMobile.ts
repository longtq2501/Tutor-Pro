import { useMediaQuery } from './useMediaQuery';
import { MEDIA_QUERIES } from '@/lib/constants/breakpoints';

/**
 * Simple, SSR-safe hook to detect if the user is on a mobile-sized screen.
 * Uses screen-width detection via centralized media query constants.
 * 
 * Logic: Prioritizes screen width for layout decisions.
 * This is hydration-safe as it delegates to the useMediaQuery hook.
 * 
 * @returns {boolean} True if the current viewport is mobile-sized (< 768px).
 */
export const useIsMobile = (): boolean => {
    return useMediaQuery(MEDIA_QUERIES.IS_MOBILE);
};
