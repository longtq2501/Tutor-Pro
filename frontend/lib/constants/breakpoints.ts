/**
 * Centralized breakpoints for responsive design.
 * These values correspond to Tailwind CSS standard breakpoints.
 */
export const BREAKPOINTS = {
    /** Small phones and phablets */
    SM: 640,
    /** Tablets (portrait) - Standard Mobile Breakpoint */
    MD: 768,
    /** Tablets (landscape) and small laptops */
    LG: 1024,
    /** Desktop monitors */
    XL: 1280,
    /** Wide monitors */
    XXL: 1536,
} as const;

/**
 * Common media queries derived from BREAKPOINTS.
 */
export const MEDIA_QUERIES = {
    /** Mobile phones up to just before Tablet/MD */
    IS_MOBILE: `(max-width: ${BREAKPOINTS.MD - 1}px)`,
    /** Tablets within the MD range up to LG */
    IS_TABLET: `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`,
    /** Standard Desktop view */
    IS_DESKTOP: `(min-width: ${BREAKPOINTS.LG}px)`,
} as const;
