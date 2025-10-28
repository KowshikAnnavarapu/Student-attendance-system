import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { StudentsPage } from './pages/StudentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { ReportsPage } from './pages/ReportsPage';
import './App.css';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>🎓 Student Attendance System</h1>
        <div className="nav-links">
          <Link to="/students">Students</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/reports">Reports</Link>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
