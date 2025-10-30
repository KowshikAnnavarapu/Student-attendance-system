import { apiClient } from './client';
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  ApiResponse,
} from '../types';

export const studentsApi = {
  getAll: async (activeOnly?: boolean): Promise<ApiResponse<Student[]>> => {
    const query = activeOnly ? '?activeOnly=true' : '';
    return apiClient.get<Student[]>(`/students${query}`);
  },
  
  getById: async (id: string): Promise<ApiResponse<Student>> => {
    return apiClient.get<Student>(`/students/${id}`);
  },
  
  getByRollNumber: async (rollNumber: string): Promise<ApiResponse<Student>> => {
    return apiClient.get<Student>(`/students/roll/${rollNumber}`);
  },
  
  search: async (name: string): Promise<ApiResponse<Student[]>> => {
    return apiClient.get<Student[]>(`/students/search?name=${encodeURIComponent(name)}`);
  },
  
  getByDepartment: async (department: string): Promise<ApiResponse<Student[]>> => {
    return apiClient.get<Student[]>(`/students/department/${department}`);
  },
  
  create: async (data: CreateStudentRequest): Promise<ApiResponse<Student>> => {
    return apiClient.post<Student>('/students', data);
  },
  
  update: async (id: string, data: UpdateStudentRequest): Promise<ApiResponse<Student>> => {
    return apiClient.put<Student>(`/students/${id}`, data);
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/students/${id}`);
  },
  
  deactivate: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.patch<void>(`/students/${id}/deactivate`);
  },
  
  getActiveCount: async (): Promise<ApiResponse<number>> => {
    return apiClient.get<number>('/students/stats/count');
  },
};
