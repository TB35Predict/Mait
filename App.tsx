import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-dark-bg font-sans">
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route path="/dashboard/:userId" element={<UserDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;