import { create } from 'zustand';
import { Attendance } from '../types';
import { attendanceApi } from '../api';

interface AttendanceStore {
  todayAttendance: Attendance[];
  loading: boolean;
  error: string | null;
  selectedDate: string;
  fetchTodayAttendance: () => Promise<void>;
  fetchAttendanceForDate: (date: string) => Promise<void>;
  refreshAttendance: () => Promise<void>;
  setSelectedDate: (date: string) => void;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  todayAttendance: [],
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  
  fetchTodayAttendance: async () => {
    set({ loading: true, error: null });
    const response = await attendanceApi.getToday();
    if (response.success && response.data) {
      set({ todayAttendance: response.data, loading: false });
    } else {
      set({ error: response.error || 'Failed to fetch attendance', loading: false });
    }
  },
  
  fetchAttendanceForDate: async (date: string) => {
    set({ loading: true, error: null });
    const response = await attendanceApi.getForDate(date);
    if (response.success && response.data) {
      set({ todayAttendance: response.data, loading: false });
    } else {
      set({ error: response.error || 'Failed to fetch attendance', loading: false });
    }
  },
  
  refreshAttendance: async () => {
    const { selectedDate } = get();
    const response = await attendanceApi.getForDate(selectedDate);
    if (response.success && response.data) {
      set({ todayAttendance: response.data });
    }
  },
  
  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },
}));
