import api from './axios-instance';
import type { OverviewStats, MonthlyRevenue, ActivityLog } from '../types/admin';
import type { PageResponse } from '../types/common';

export const adminStatsApi = {
    getOverview: async (): Promise<OverviewStats> => {
        const response = await api.get('/admin/stats/overview');
        return response.data.data;
    },

    getMonthlyRevenue: async (months = 6): Promise<MonthlyRevenue[]> => {
        const response = await api.get(`/admin/stats/monthly-revenue?months=${months}`);
        return response.data.data;
    },

    getActivityLog: async (page = 0, size = 20): Promise<PageResponse<ActivityLog>> => {
        const response = await api.get(`/admin/activity-log?page=${page}&size=${size}`);
        return response.data.data;
    },
};
