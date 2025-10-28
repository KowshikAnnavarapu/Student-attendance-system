import { useEffect, useState } from 'react';
import { useStudentStore } from '../store/useStudentStore';
import { studentsApi } from '../api';
import type { CreateStudentRequest } from '../types';

export function StudentsPage() {
  const { students, loading, error, fetchStudents, refreshStudents } = useStudentStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateStudentRequest>({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: '',
    year: 1,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await studentsApi.create(formData);
    
    if (response.success) {
      setMessage({ type: 'success', text: 'Student added successfully!' });
      setFormData({ name: '', rollNumber: '', email: '', phone: '', department: '', year: 1 });
      setShowForm(false);
      refreshStudents();
    } else {
      setMessage({ type: 'error', text: response.error || 'Failed to add student' });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page">
      <h1>Students</h1>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? 'Cancel' : 'Add New Student'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Roll Number"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            >
              <option value={1}>Year 1</option>
              <option value={2}>Year 2</option>
              <option value={3}>Year 3</option>
              <option value={4}>Year 4</option>
            </select>
          </div>
          <button type="submit" className="btn-success">Add Student</button>
        </form>
      )}

      <div className="students-list">
        <h2>All Students ({students.length})</h2>
        {students.length === 0 ? (
          <p>No students found. Add your first student!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><strong>{student.rollNumber}</strong></td>
                  <td>{student.name}</td>
                  <td>{student.email || '—'}</td>
                  <td>{student.phone || '—'}</td>
                  <td>{student.department || '—'}</td>
                  <td>{student.year ? `Year ${student.year}` : '—'}</td>
                  <td>{student.active ? '✅ Active' : '❌ Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
