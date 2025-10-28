import { apiClient } from './client';
import type {
  Attendance,
  MarkAttendanceRequest,
  StudentAttendanceHistory,
  AttendanceStats,
  ApiResponse,
  AttendanceStatus,
} from '../types';

export const attendanceApi = {
  mark: async (data: MarkAttendanceRequest): Promise<ApiResponse<Attendance>> => {
    return apiClient.post<Attendance>('/attendance/mark', data);
  },
  
  getToday: async (): Promise<ApiResponse<Attendance[]>> => {
    return apiClient.get<Attendance[]>('/attendance/today');
  },
  
  getForDate: async (date: string): Promise<ApiResponse<Attendance[]>> => {
    return apiClient.get<Attendance[]>(`/attendance/date/${date}`);
  },
  
  getByDateRange: async (startDate: string, endDate: string): Promise<ApiResponse<Attendance[]>> => {
    return apiClient.get<Attendance[]>(
      `/attendance/range?startDate=${startDate}&endDate=${endDate}`
    );
  },
  
  getStudentHistory: async (rollNumber: string): Promise<ApiResponse<StudentAttendanceHistory>> => {
    return apiClient.get<StudentAttendanceHistory>(`/attendance/student/${rollNumber}`);
  },
  
  getStudentHistoryByRange: async (
    rollNumber: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<StudentAttendanceHistory>> => {
    return apiClient.get<StudentAttendanceHistory>(
      `/attendance/student/${rollNumber}/range?startDate=${startDate}&endDate=${endDate}`
    );
  },
  
  getStudentStats: async (rollNumber: string): Promise<ApiResponse<AttendanceStats>> => {
    return apiClient.get<AttendanceStats>(`/attendance/student/${rollNumber}/stats`);
  },
  
  getStudentStatsByRange: async (
    rollNumber: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<AttendanceStats>> => {
    return apiClient.get<AttendanceStats>(
      `/attendance/student/${rollNumber}/stats/range?startDate=${startDate}&endDate=${endDate}`
    );
  },
  
  getByStatus: async (
    status: AttendanceStatus,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Attendance[]>> => {
    return apiClient.get<Attendance[]>(
      `/attendance/status/${status}?startDate=${startDate}&endDate=${endDate}`
    );
  },
};
