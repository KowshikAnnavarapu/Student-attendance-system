import { useEffect, useState } from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { attendanceApi } from '../api';
import type { MarkAttendanceRequest, AttendanceStatus } from '../types';

export function AttendancePage() {
  const { todayAttendance, loading, error, fetchTodayAttendance, refreshAttendance } = useAttendanceStore();
  const [rollNumber, setRollNumber] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: MarkAttendanceRequest = {
      rollNumber: rollNumber.toUpperCase(),
      status,
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1>Mark Attendance</h1>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <h2>Mark Today's Attendance</h2>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
            required
          />
          <select value={status} onChange={(e) => setStatus(e.target.value as AttendanceStatus)}>
            <option value="PRESENT">✅ Present</option>
            <option value="ABSENT">❌ Absent</option>
          </select>
        </div>
        <button type="submit" className="btn-success">Mark Attendance</button>
      </form>

      <div className="attendance-list">
        <h2>Today's Attendance ({todayAttendance.length})</h2>
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
              </tr>
            </thead>
            <tbody>
              {todayAttendance.map((record) => (
                <tr key={record.id}>
                  <td><strong>{record.rollNumber}</strong></td>
                  <td>{record.studentName}</td>
                  <td>
                    {record.status === 'PRESENT' ? '✅ Present' : '❌ Absent'}
                  </td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
