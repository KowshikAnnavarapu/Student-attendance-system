import { useEffect, useState } from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { attendanceApi } from '../api';
import type { MarkAttendanceRequest, AttendanceStatus, Attendance } from '../types';

export function AttendancePage() {
  const { todayAttendance, loading, error, selectedDate, fetchAttendanceForDate, refreshAttendance, setSelectedDate } = useAttendanceStore();
  const [rollNumber, setRollNumber] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ rollNumber: string; status: AttendanceStatus }>({ 
    rollNumber: '', 
    status: 'PRESENT' 
  });

  useEffect(() => {
    fetchAttendanceForDate(selectedDate);
  }, [fetchAttendanceForDate, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: MarkAttendanceRequest = {
      rollNumber: rollNumber.toUpperCase(),
      status,
      date: selectedDate,
    };
    
    const response = await attendanceApi.mark(request);
    
    if (response.success) {
      setMessage({ type: 'success', text: 'Attendance marked successfully!' });
      setRollNumber('');
      refreshAttendance();
    } else {
      setMessage({ type: 'error', text: response.error || 'Failed to mark attendance' });
    }
  };

  const handleEdit = (attendance: Attendance) => {
    setEditingId(attendance.id);
    setEditData({
      rollNumber: attendance.rollNumber,
      status: attendance.status
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;
    
    const request: MarkAttendanceRequest = {
      rollNumber: editData.rollNumber.toUpperCase(),
      status: editData.status,
      date: selectedDate,
    };
    
    const response = await attendanceApi.update(editingId, request);
    
    if (response.success) {
      setMessage({ type: 'success', text: 'Attendance updated successfully!' });
      setEditingId(null);
      refreshAttendance();
    } else {
      setMessage({ type: 'error', text: response.error || 'Failed to update attendance' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this attendance record? This action cannot be undone.')) {
      const response = await attendanceApi.delete(id);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Attendance deleted successfully!' });
        refreshAttendance();
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to delete attendance' });
      }
    }
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1>Attendance Management</h1>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="date-selector" style={{ marginBottom: '20px' }}>
        <label htmlFor="attendance-date" style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Select Date:
        </label>
        <input
          id="attendance-date"
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            cursor: 'pointer'
          }}
        />
      </div>

      <form onSubmit={handleSubmit} className="form">
        <h2>Mark Attendance for {new Date(selectedDate).toLocaleDateString()}</h2>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Roll Number (8 digits)"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, '').slice(0, 8).toUpperCase())}
            required
          />
          <div className={`custom-select status-select ${status === 'ABSENT' ? 'absent' : ''}`}>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
            >
              <option value="PRESENT">✅ Present</option>
              <option value="ABSENT">❌ Absent</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-success">
          Mark Attendance
        </button>
      </form>

      <div className="attendance-list">
        <h2>Attendance for {new Date(selectedDate).toLocaleDateString()} ({todayAttendance.length})</h2>
        {error && <div className="error">{error}</div>}
        {todayAttendance.length === 0 ? (
          <p>No attendance records for today.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.map((record) => (
                <tr key={record.id} className="attendance-row">
                  {editingId === record.id ? (
                    <td colSpan={5}>
                      <form onSubmit={handleUpdate} className="form">
                        <h3>Edit Attendance</h3>
                        <div className="form-grid">
                          <input
                            type="text"
                            placeholder="Roll Number"
                            value={editData.rollNumber}
                            onChange={(e) => setEditData({ ...editData, rollNumber: e.target.value.toUpperCase() })}
                            required
                          />
                          <div className={`custom-select status-select ${editData.status === 'ABSENT' ? 'absent' : ''}`}>
                            <select 
                              value={editData.status} 
                              onChange={(e) => setEditData({ ...editData, status: e.target.value as AttendanceStatus })}
                            >
                              <option value="PRESENT">✅ Present</option>
                              <option value="ABSENT">❌ Absent</option>
                            </select>
                          </div>
                        </div>
                        <div className="action-buttons">
                          <button type="submit" className="btn-success">Update</button>
                          <button type="button" className="btn-outline" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td><strong>{record.rollNumber}</strong></td>
                      <td>{record.studentName}</td>
                      <td>
                        {record.status === 'PRESENT' ? (
                          <span className="status-present">✅ Present</span>
                        ) : (
                          <span className="status-absent">❌ Absent</span>
                        )}
                      </td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-warning"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-danger"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}