import { create } from 'zustand';
import { Attendance } from '../types';
import { attendanceApi } from '../api';

interface AttendanceStore {
  todayAttendance: Attendance[];
  loading: boolean;
  error: string | null;
  fetchTodayAttendance: () => Promise<void>;
  refreshAttendance: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  todayAttendance: [],
  loading: false,
  error: null,
  
  fetchTodayAttendance: async () => {
    set({ loading: true, error: null });
    const response = await attendanceApi.getToday();
    if (response.success && response.data) {
      set({ todayAttendance: response.data, loading: false });
    } else {
      set({ error: response.error || 'Failed to fetch attendance', loading: false });
    }
  },
  
  refreshAttendance: async () => {
    const response = await attendanceApi.getToday();
    if (response.success && response.data) {
      set({ todayAttendance: response.data });
    }
  },
}));
