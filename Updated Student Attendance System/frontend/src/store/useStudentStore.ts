import { create } from 'zustand';
import { Student } from '../types';
import { studentsApi } from '../api';

interface StudentStore {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  refreshStudents: () => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set) => ({
  students: [],
  loading: false,
  error: null,
  
  fetchStudents: async () => {
    set({ loading: true, error: null });
    const response = await studentsApi.getAll();
    if (response.success && response.data) {
      set({ students: response.data, loading: false });
    } else {
      set({ error: response.error || 'Failed to fetch students', loading: false });
    }
  },
  
  refreshStudents: async () => {
    const response = await studentsApi.getAll();
    if (response.success && response.data) {
      set({ students: response.data });
    }
  },
}));
