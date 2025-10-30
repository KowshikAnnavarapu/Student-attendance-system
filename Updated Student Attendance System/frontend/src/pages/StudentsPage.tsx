import { useEffect, useState } from 'react';
import { useStudentStore } from '../store/useStudentStore';
import { studentsApi } from '../api';
import type { CreateStudentRequest, Student, UpdateStudentRequest } from '../types';

export function StudentsPage() {
  const { students, loading, error, fetchStudents, refreshStudents } = useStudentStore();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: '',
    year: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.rollNumber) {
      newErrors.rollNumber = 'Roll number is required';
    } else if (!/^\d{8}$/.test(formData.rollNumber)) {
      newErrors.rollNumber = 'Roll number must be exactly 8 digits';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    
    if (!formData.department?.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing && editingStudentId) {
        // Update existing student
        const updateData: UpdateStudentRequest = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          year: formData.year,
        };
        
        const response = await studentsApi.update(editingStudentId, updateData);
        
        if (response.success) {
          setMessage({ type: 'success', text: 'Student updated successfully!' });
          resetForm();
          refreshStudents();
        } else {
          setMessage({ type: 'error', text: response.error || 'Failed to update student' });
        }
      } else {
        // Create new student
        const response = await studentsApi.create(formData);
        
        if (response.success) {
          setMessage({ type: 'success', text: 'Student added successfully!' });
          resetForm();
          refreshStudents();
        } else {
          setMessage({ type: 'error', text: response.error || 'Failed to add student' });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email || '',
      phone: student.phone || '',
      department: student.department || '',
      year: student.year || 1,
    });
    setIsEditing(true);
    setEditingStudentId(student.id);
    setShowForm(true);
  };

  const handleDelete = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        const response = await studentsApi.delete(studentId);
        if (response.success) {
          setMessage({ type: 'success', text: 'Student deleted successfully!' });
          refreshStudents();
        } else {
          setMessage({ type: 'error', text: response.error || 'Failed to delete student' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'An unexpected error occurred' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      department: '',
      year: 1,
    });
    setErrors({});
    setShowForm(false);
    setIsEditing(false);
    setEditingStudentId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="students-content">
      <h1>Students Management</h1>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <button onClick={() => {
        resetForm();
        setShowForm(!showForm);
      }} className="btn-primary">
        {showForm ? 'Cancel' : 'Add New Student'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <h2>{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
          <div className="form-grid">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <div className="message error">{errors.name}</div>}
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Roll Number (8 digits)"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.replace(/\D/g, '').slice(0, 8) })}
                disabled={isEditing}
              />
              {errors.rollNumber && <div className="message error">{errors.rollNumber}</div>}
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <div className="message error">{errors.email}</div>}
            </div>
            
            <div>
              <input
                type="tel"
                placeholder="Phone (10 digits)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              />
              {errors.phone && <div className="message error">{errors.phone}</div>}
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
              {errors.department && <div className="message error">{errors.department}</div>}
            </div>
            
            <div>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              >
                <option value={1}>First Year</option>
                <option value={2}>Second Year</option>
                <option value={3}>Third Year</option>
                <option value={4}>Fourth Year</option>
              </select>
              {errors.year && <div className="message error">{errors.year}</div>}
            </div>
          </div>
          
          <button type="submit" className="btn-success">
            {isEditing ? 'Update Student' : 'Add Student'}
          </button>
        </form>
      )}

      <div className="students-list">
        <h2>Students List ({students.length})</h2>
        {students.length === 0 ? (
          <p>No students found. Add a new student to get started.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><strong>{student.rollNumber}</strong></td>
                  <td>{student.name}</td>
                  <td>{student.email || '—'}</td>
                  <td>{student.department || '—'}</td>
                  <td>
                    {student.year === 1 && 'First Year'}
                    {student.year === 2 && 'Second Year'}
                    {student.year === 3 && 'Third Year'}
                    {student.year === 4 && 'Fourth Year'}
                    {!student.year && '—'}
                  </td>
                  <td>
                    {student.active ? (
                      <span className="status-present">✅ Active</span>
                    ) : (
                      <span className="status-absent">❌ Inactive</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-outline"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}