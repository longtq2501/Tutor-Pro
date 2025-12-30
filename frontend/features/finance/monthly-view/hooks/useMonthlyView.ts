import { useState, useMemo } from 'react';
import { useMonthlyRecords } from './useMonthlyRecords';
import { useAutoGenerate } from './useAutoGenerate';
import { useStudentSelection } from './useStudentSelection';
import { useInvoiceActions } from './useInvoiceActions';
import { groupRecordsByStudent, calculateTotalStats, calculateSelectedStats } from '../utils/groupRecords';

export function useMonthlyView() {
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const [emailResult, setEmailResult] = useState<any>(null);

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

    const changeMonth = (direction: number) => {
        const date = new Date(selectedMonth + '-01');
        date.setMonth(date.getMonth() + direction);
        setSelectedMonth(date.toISOString().slice(0, 7));
        selection.clear();
    };

    const handleAutoGenerate = () => {
        autoGen.generate(loadRecords);
    };

    const handleGenerateCombinedInvoice = async () => {
        if (selection.selectedStudents.length === 0) return;
        const allSessionIds = selection.selectedStudents.flatMap(
            id => groupedRecordsMap[id]?.sessions.map((s: any) => s.id) || []
        );
        await invoice.generateCombined(selection.selectedStudents, selectedMonth, allSessionIds);
    };

    const handleSendEmail = async () => {
        if (selection.selectedStudents.length === 0) return;
        const result = await invoice.sendEmail(selection.selectedStudents, selectedMonth);
        if (result) {
            setEmailResult(result);
        }
    };

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
