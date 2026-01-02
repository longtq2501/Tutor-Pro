import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateSelectedStats, calculateTotalStats, groupRecordsByStudent } from '../utils/groupRecords';
import { useAutoGenerate } from './useAutoGenerate';
import { useInvoiceActions } from './useInvoiceActions';
import { useMonthlyRecords } from './useMonthlyRecords';
import { useStudentSelection } from './useStudentSelection';

export function useMonthlyView() {
    const searchParams = useSearchParams();
    const monthFromUrl = searchParams.get('month');

    const [selectedMonth, setSelectedMonth] = useState(
        monthFromUrl || new Date().toISOString().slice(0, 7)
    );
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const [emailResult, setEmailResult] = useState<any>(null);

    // Sync URL month parameter changes to state
    useEffect(() => {
        if (monthFromUrl && monthFromUrl !== selectedMonth) {
            setSelectedMonth(monthFromUrl);
        }
    }, [monthFromUrl]);

    const { records, loading, loadRecords, togglePayment, deleteRecord } = useMonthlyRecords(selectedMonth);
    const autoGen = useAutoGenerate(selectedMonth);
    const groupedRecordsArray = useMemo(() => groupRecordsByStudent(records), [records]);
    const selection = useStudentSelection(groupedRecordsArray);
    const invoice = useInvoiceActions();

    const totalStats = useMemo(() => calculateTotalStats(records), [records]);

    const groupedRecordsMap = useMemo(() => {
        return groupedRecordsArray.reduce((acc, g) => {
            acc[g.studentId] = g;
            return acc;
        }, {} as Record<number, any>);
    }, [groupedRecordsArray]);

    const selectedStats = useMemo(
        () => calculateSelectedStats(selection.selectedStudents, groupedRecordsMap),
        [selection.selectedStudents, groupedRecordsMap]
    );

    const changeMonth = useCallback((direction: number) => {
        const date = new Date(selectedMonth + '-01');
        date.setMonth(date.getMonth() + direction);
        setSelectedMonth(date.toISOString().slice(0, 7));
        selection.clear();
    }, [selectedMonth, selection]);

    const handleAutoGenerate = useCallback(() => {
        autoGen.generate(loadRecords);
    }, [autoGen, loadRecords]);

    const handleGenerateCombinedInvoice = useCallback(async () => {
        if (selection.selectedStudents.length === 0) return;
        const allSessionIds = selection.selectedStudents.flatMap(
            id => groupedRecordsMap[id]?.sessions.map((s: any) => s.id) || []
        );
        await invoice.generateCombined(selection.selectedStudents, selectedMonth, allSessionIds);
    }, [selection.selectedStudents, groupedRecordsMap, invoice, selectedMonth]);

    const handleSendEmail = useCallback(async () => {
        if (selection.selectedStudents.length === 0) return;
        const result = await invoice.sendEmail(selection.selectedStudents, selectedMonth);
        if (result) {
            setEmailResult(result);
        }
    }, [selection.selectedStudents, invoice, selectedMonth]);

    return {
        selectedMonth,
        emailResult,
        setEmailResult,
        records,
        loading,
        togglePayment,
        deleteRecord,
        autoGen,
        groupedRecordsArray,
        selection,
        invoice,
        totalStats,
        selectedStats,
        changeMonth,
        handleAutoGenerate,
        handleGenerateCombinedInvoice,
        handleSendEmail,
    };
}
