import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Nichos from './pages/Nichos';
import PerfilesGMB from './pages/PerfilesGMB';
import Tecnicos from './pages/Tecnicos';
import CallCenter from './pages/CallCenter'; // Import the new Call Center page

function App() {
  const { initialize, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nichos" element={<Nichos />} />
          <Route path="/perfiles-gmb" element={<PerfilesGMB />} />
          <Route path="/tecnicos" element={<Tecnicos />} />
          <Route path="/call-center" element={<CallCenter />} /> {/* Add the new route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
