import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import Patients from './pages/Patients';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Audit } from './pages/Audit';
import { PatientDetail } from './pages/PatientDetail';
import { Exams } from './pages/Exams';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas envueltas en el Layout (Sidebar) */}
            <Route element={<Layout><ProtectedRoute /></Layout>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/exams" element={<Exams />} />
              
              {/* Rutas exclusivas de administrador */}
              <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
                <Route path="/users" element={<Users />} />
                <Route path="/audit" element={<Audit />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;