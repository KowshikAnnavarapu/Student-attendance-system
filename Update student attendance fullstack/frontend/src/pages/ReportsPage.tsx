import { useState } from 'react';
import { attendanceApi } from '../api';
import type { StudentAttendanceHistory } from '../types';

export function ReportsPage() {
  const [rollNumber, setRollNumber] = useState('');
  const [history, setHistory] = useState<StudentAttendanceHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (dateRange.start && dateRange.end) {
        response = await attendanceApi.getStudentHistoryByRange(
          rollNumber.toUpperCase(), 
          dateRange.start, 
          dateRange.end
        );
      } else {
        response = await attendanceApi.getStudentHistory(rollNumber.toUpperCase());
      }
      
      if (response.success && response.data) {
        setHistory(response.data);
      } else {
        setError(response.error || 'Failed to fetch history');
        setHistory(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setRollNumber('');
    setHistory(null);
    setError(null);
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="page">
      <h1>Student Reports</h1>

      <form onSubmit={handleSearch} className="form">
        <h2>Search Student History</h2>
        <div className="form-grid">
          <div>
            <input
              type="text"
              placeholder="Enter Roll Number (8 digits)"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, '').slice(0, 8).toUpperCase())}
              required
            />
          </div>
          <div>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="action-buttons">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button type="button" className="btn-outline" onClick={resetSearch}>
              Reset
            </button>
          </div>
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      {history && (
        <div className="report-details">
          <div className="student-info">
            <h2>Student Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>Name:</strong> {history.student.name}
              </div>
              <div className="info-item">
                <strong>Roll Number:</strong> {history.student.rollNumber}
              </div>
              <div className="info-item">
                <strong>Email:</strong> {history.student.email || '—'}
              </div>
              <div className="info-item">
                <strong>Department:</strong> {history.student.department || '—'}
              </div>
              <div className="info-item">
                <strong>Year:</strong> 
                {history.student.year === 1 && 'First Year'}
                {history.student.year === 2 && 'Second Year'}
                {history.student.year === 3 && 'Third Year'}
                {history.student.year === 4 && 'Fourth Year'}
                {!history.student.year && '—'}
              </div>
              <div className="info-item">
                <strong>Status:</strong> {history.student.active ? '✅ Active' : '❌ Inactive'}
              </div>
            </div>
          </div>

          <div className="statistics">
            <h2>Attendance Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{history.statistics.totalDays}</div>
                <div className="stat-label">Total Records</div>
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
                <div className="stat-value">{history.statistics.attendancePercentage}%</div>
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
                    <tr key={record.id} className="history-row">
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        {record.status === 'PRESENT' ? (
                          <span className="status-present">✅ Present</span>
                        ) : (
                          <span className="status-absent">❌ Absent</span>
                        )}
                      </td>
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