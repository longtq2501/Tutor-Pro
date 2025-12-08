// src/lib/types.ts
export interface Student {
    id: number;
    name: string;
    phone?: string;
    schedule: string;
    pricePerHour: number;
    notes?: string;
    createdAt: string;
    totalPaid: number;
    totalUnpaid: number;
  }
  
  export interface StudentRequest {
    name: string;
    phone?: string;
    schedule: string;
    pricePerHour: number;
    notes?: string;
  }
  
  export interface SessionRecordRequest {
    studentId: number;
    month: string;
    sessions: number;
    hoursPerSession: number; // Thêm field này
    notes?: string;
  }
  
  export interface SessionRecord {
    id: number;
    studentId: number;
    studentName: string;
    month: string;
    sessions: number;
    hours: number;
    pricePerHour: number;
    totalAmount: number;
    paid: boolean;
    paidAt?: string;
    notes?: string;
    createdAt: string;
  }
  
  // export interface SessionRecordRequest {
  //   studentId: number;
  //   month: string;
  //   sessions: number;
  //   notes?: string;
  // }
  
  export interface DashboardStats {
    totalStudents: number;
    totalPaidAllTime: number;
    totalUnpaidAllTime: number;
    currentMonthTotal: number;
    currentMonthUnpaid: number;
  }
  
  export interface MonthlyStats {
    month: string;
    totalPaid: number;
    totalUnpaid: number;
    totalSessions: number;
  }