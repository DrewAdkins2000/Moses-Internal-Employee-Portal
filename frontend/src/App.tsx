import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TrainingCenter from './pages/TrainingCenter';
import EventsPage from './pages/EventsPage';
import DocumentsPage from './pages/DocumentsPage';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-moses-light">
        <LoadingSpinner />
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-moses-blue">Moses AutoMall Portal</h2>
          <p className="text-gray-600">Authenticating with Windows credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/training" element={<TrainingCenter />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
