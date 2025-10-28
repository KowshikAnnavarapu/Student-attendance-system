import { useState } from 'react';
import { attendanceApi } from '../api';
import type { StudentAttendanceHistory } from '../types';

export function ReportsPage() {
  const [rollNumber, setRollNumber] = useState('');
  const [history, setHistory] = useState<StudentAttendanceHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const response = await attendanceApi.getStudentHistory(rollNumber.toUpperCase());
    
    if (response.success && response.data) {
      setHistory(response.data);
    } else {
      setError(response.error || 'Failed to fetch history');
      setHistory(null);
    }
    
    setLoading(false);
  };

  return (
    <div className="page">
      <h1>Student Reports</h1>

      <form onSubmit={handleSearch} className="form">
        <h2>Search Student History</h2>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      {history && (
        <div className="report-details">
          <div className="student-info">
            <h2>Student Information</h2>
            <p><strong>Name:</strong> {history.student.name}</p>
            <p><strong>Roll Number:</strong> {history.student.rollNumber}</p>
            <p><strong>Email:</strong> {history.student.email || '—'}</p>
            <p><strong>Department:</strong> {history.student.department || '—'}</p>
          </div>

          <div className="statistics">
            <h2>Attendance Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{history.statistics.totalDays}</div>
                <div className="stat-label">Total Days</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{history.statistics.presentDays}</div>
                <div className="stat-label">Present</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{history.statistics.absentDays}</div>
                <div className="stat-label">Absent</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{history.statistics.attendancePercentage.toFixed(2)}%</div>
                <div className="stat-label">Percentage</div>
              </div>
            </div>
          </div>

          <div className="attendance-history">
            <h2>Attendance History</h2>
            {history.attendanceRecords.length === 0 ? (
              <p>No attendance records found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.attendanceRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.status === 'PRESENT' ? '✅ Present' : '❌ Absent'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
