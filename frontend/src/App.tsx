import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

function AppRoutes() {
  const { token, role } = useAuth();

  if (!token) return <Login />;

  if (role === 'manager') return <ManagerDashboard />;
  if (role === 'engineer') return <EngineerDashboard />;

  return <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}