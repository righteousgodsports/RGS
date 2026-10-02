import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import HeroPage from './pages/admin/HeroPage';
import BikesPage from './pages/admin/BikesPage';
import AthletesPage from './pages/admin/AthletesPage';
import JerseysPage from './pages/admin/JerseysPage';
import MembersPage from './pages/admin/MembersPage';
import MessagesPage from './pages/admin/MessagesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="hero" element={<HeroPage />} />
              <Route path="bikes" element={<BikesPage />} />
              <Route path="athletes" element={<AthletesPage />} />
              <Route path="jerseys" element={<JerseysPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="messages" element={<MessagesPage />} />
            </Route>
          </Routes>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
