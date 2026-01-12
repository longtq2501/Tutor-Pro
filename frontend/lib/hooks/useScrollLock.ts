'use client';

import { useEffect } from 'react';

/**
 * Custom hook to lock body scroll when a modal or dialog is open.
 * Handles nested modals by checking for existing dialogs before unlocking.
 * 
 * @param {boolean} lock - Whether to lock the scroll. Defaults to true.
 */
export const useScrollLock = (lock: boolean = true) => {
    useEffect(() => {
        if (!lock) return;

        // Save original overflow style
        const originalStyle = window.getComputedStyle(document.body).overflow;

        // Apply lock
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');

        return () => {
            // Cleanup: Check if other modals are still open before unlocking
            // Use setTimeout to allow the unmounting modal to be removed from the DOM
            setTimeout(() => {
                const otherModals = document.querySelectorAll('[role="dialog"]');
                if (otherModals.length === 0) {
                    document.body.style.overflow = originalStyle === 'hidden' ? 'unset' : originalStyle;
                    document.body.classList.remove('modal-open');
                }
            }, 0);
        };
    }, [lock]);
};
