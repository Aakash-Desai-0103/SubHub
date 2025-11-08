import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// --- Import all pages ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AllSubscriptionsPage from './pages/AllSubscriptionsPage';
import AddSubscriptionPage from './pages/AddSubscriptionPage';
import EditSubscriptionPage from './pages/EditSubscriptionPage';
import UpgradeSubscriptionPage from './pages/UpgradeSubscriptionPage'; // ✅ NEW IMPORT
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import { useAuth } from './context/AuthContext'; // ✅ Needed for conditional redirect

function App() {
  const { isAuthenticated } = useAuth(); // ✅ Get auth state from context

  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- Protected Routes --- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <AllSubscriptionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions/new"
        element={
          <ProtectedRoute>
            <AddSubscriptionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions/edit/:id"
        element={
          <ProtectedRoute>
            <EditSubscriptionPage />
          </ProtectedRoute>
        }
      />
      {/* ✅ NEW UPGRADE ROUTE */}
      <Route
        path="/subscriptions/upgrade/:id"
        element={
          <ProtectedRoute>
            <UpgradeSubscriptionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* --- Catch-All Route (404) --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
