import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
