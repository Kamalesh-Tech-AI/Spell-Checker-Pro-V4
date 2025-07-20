import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="user">
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64">
                  <UserDashboard />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64">
                  <AdminDashboard />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/upload" element={
            <ProtectedRoute requiredRole="admin">
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64">
                  <AdminDashboard />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/stats" element={
            <ProtectedRoute requiredRole="admin">
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64">
                  <AdminDashboard />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/history" element={
            <ProtectedRoute requiredRole="admin">
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64">
                  <AdminDashboard />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;