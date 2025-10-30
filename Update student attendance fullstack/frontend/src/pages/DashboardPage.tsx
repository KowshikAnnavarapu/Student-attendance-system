import { useState } from 'react';
import { StudentsPage } from './StudentsPage';
import { AttendancePage } from './AttendancePage';
import { ReportsPage } from './ReportsPage';
import { useStudentStore } from '../store/useStudentStore';
import { useAttendanceStore } from '../store/useAttendanceStore';
import '../App.css';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { students } = useStudentStore();
  const { todayAttendance } = useAttendanceStore();
  
  // Calculate dashboard statistics
  const activeStudents = students.filter(student => student.active).length;
  const presentToday = todayAttendance.filter(att => att.status === 'PRESENT').length;
  const absentToday = todayAttendance.filter(att => att.status === 'ABSENT').length;
  const attendancePercentage = todayAttendance.length > 0 
    ? Math.round((presentToday / todayAttendance.length) * 10000) / 100 
    : 0;

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <h2>🎓 Student Attendance</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        {activeTab === 'dashboard' && (
          <div className="page">
            <h1>Dashboard</h1>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{activeStudents}</div>
                <div className="stat-label">Total Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{presentToday}</div>
                <div className="stat-label">Present Today</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{absentToday}</div>
                <div className="stat-label">Absent Today</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{attendancePercentage}%</div>
                <div className="stat-label">Attendance Rate</div>
              </div>
            </div>
            
            <div className="dashboard-content">
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <p>Welcome to the Student Attendance System! Use the navigation menu to manage students, attendance, and reports.</p>
                  <p>Today's attendance has been recorded for {todayAttendance.length} students.</p>
                </div>
              </div>
              
              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => setActiveTab('students')}
                  >
                    Add Student
                  </button>
                  <button 
                    className="btn-success"
                    onClick={() => setActiveTab('attendance')}
                  >
                    Mark Attendance
                  </button>
                  <button 
                    className="btn-outline"
                    onClick={() => setActiveTab('reports')}
                  >
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'students' && (
          <div className="page-transition">
            <StudentsPage />
          </div>
        )}
        {activeTab === 'attendance' && (
          <div className="page-transition">
            <AttendancePage />
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="page-transition">
            <ReportsPage />
          </div>
        )}
      </div>
    </div>
  );
}