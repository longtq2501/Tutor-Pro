'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface AmountVisibilityContextValue {
    hideAmounts: boolean;
    setHideAmounts: (hide: boolean) => void;
    toggleAmounts: () => void;
}

const STORAGE_KEY = 'tutor-pro-hide-amounts';
const defaultContextValue: AmountVisibilityContextValue = {
    hideAmounts: false,
    setHideAmounts: () => undefined,
    toggleAmounts: () => undefined,
};
const AmountVisibilityContext = createContext<AmountVisibilityContextValue>(defaultContextValue);

export function AmountVisibilityProvider({ children }: { children: ReactNode }) {
    const [hideAmounts, setHideAmountsState] = useState(false);

    useEffect(() => {
        const storedValue = window.localStorage.getItem(STORAGE_KEY);
        if (storedValue !== null) {
            window.setTimeout(() => setHideAmountsState(storedValue === 'true'), 0);
        }
    }, []);

    const setHideAmounts = useCallback((hide: boolean) => {
        setHideAmountsState(hide);
        window.localStorage.setItem(STORAGE_KEY, String(hide));
    }, []);

    const toggleAmounts = useCallback(() => setHideAmounts(!hideAmounts), [hideAmounts, setHideAmounts]);

    const value = useMemo(
        () => ({ hideAmounts, setHideAmounts, toggleAmounts }),
        [hideAmounts, setHideAmounts, toggleAmounts]
    );

    return <AmountVisibilityContext.Provider value={value}>{children}</AmountVisibilityContext.Provider>;
}

export function useAmountVisibility() {
    return useContext(AmountVisibilityContext);
}
