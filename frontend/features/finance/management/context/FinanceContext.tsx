'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FinanceContextType, FinanceViewMode } from '../types';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();

    // P0 FIX: Get initial date from URL param 'month'
    const initialDate = useMemo(() => {
        const monthParam = searchParams.get('month');
        if (monthParam) {
            const [year, month] = monthParam.split('-').map(Number);
            if (year && month) {
                const date = new Date(year, month - 1, 1);
                if (!isNaN(date.getTime())) return date;
            }
        }
        return new Date();
    }, [searchParams]);

    const [viewMode, setViewMode] = useState<FinanceViewMode>('MONTHLY');
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayLimit, setDisplayLimit] = useState(20); // Pagination: initial limit

    const toggleStudentSelection = useCallback((studentId: number) => {
        setSelectedStudentIds(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            }
            return [...prev, studentId];
        });
    }, []);

    const toggleSelectAll = useCallback((studentIds: number[]) => {
        setSelectedStudentIds(prev => {
            // If all are currently selected, deselect them (remove from current selection)
            const allSelected = studentIds.every(id => prev.includes(id));
            if (allSelected) {
                return prev.filter(id => !studentIds.includes(id));
            }
            // Otherwise, select missing ones
            const newIds = [...prev];
            studentIds.forEach(id => {
                if (!newIds.includes(id)) newIds.push(id);
            });
            return newIds;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedStudentIds([]);
    }, []);

    const loadMore = useCallback(() => {
        setDisplayLimit(prev => prev + 20);
    }, []);

    const resetPagination = useCallback(() => {
        setDisplayLimit(20);
    }, []);

    const value = {
        viewMode,
        selectedDate,
        selectedStudentIds,
        searchTerm,
        displayLimit,
        setViewMode,
        setSelectedDate,
        setSelectedStudentIds,
        setSearchTerm,
        toggleStudentSelection,
        toggleSelectAll,
        clearSelection,
        loadMore,
        resetPagination,
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinanceContext() {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinanceContext must be used within a FinanceProvider');
    }
    return context;
}
