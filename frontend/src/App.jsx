import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts & Common
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import SupportSidebar from './components/layout/SupportSidebar';
import ToastContainer from './components/common/ToastContainer';
import CommandPalette from './components/common/CommandPalette';
import DemoRoleSwitcher from './components/common/DemoRoleSwitcher';
import AiConciergeModal from './components/common/AiConciergeModal';
import WishlistDrawer from './components/layout/WishlistDrawer';
import ApplianceComparisonDrawer from './components/appliances/ApplianceComparisonDrawer';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AppliancesCatalog from './pages/public/AppliancesCatalog';
import ApplianceDetail from './pages/public/ApplianceDetail';
import ApplianceComparisonPage from './pages/public/ApplianceComparisonPage';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import AdminLogin from './pages/public/AdminLogin';
import SupportLogin from './pages/public/SupportLogin';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyRentals from './pages/customer/MyRentals';
import RentalTracker from './pages/customer/RentalTracker';
import CustomerPayments from './pages/customer/CustomerPayments';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerReviews from './pages/customer/CustomerReviews';
import SmartRecommendations from './pages/customer/SmartRecommendations';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppliances from './pages/admin/AdminAppliances';
import AdminRentals from './pages/admin/AdminRentals';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReturns from './pages/admin/AdminReturns';
import AdminMaintenance from './pages/admin/AdminMaintenance';
import AdminReports from './pages/admin/AdminReports';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAiInsights from './pages/admin/AdminAiInsights';
import AdminUsers from './pages/admin/AdminUsers';

// Support Pages
import SupportDashboard from './pages/support/SupportDashboard';
import SupportTickets from './pages/support/SupportTickets';
import SupportComplaints from './pages/support/SupportComplaints';
import ReviewModeration from './pages/support/ReviewModeration';

// Layout Wrappers
const PublicLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AdminLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Admin Workspace...</div>;
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <Navbar />
        <main style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const SupportLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Support Desk...</div>;
  if (!isAuthenticated || (user?.role !== 'support' && user?.role !== 'admin')) {
    return <Navigate to="/support/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <SupportSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <Navbar />
        <main style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const UniversalProfileRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading account profile...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/profile" replace />;
  if (user?.role === 'support') return <Navigate to="/support/profile" replace />;
  return <Navigate to="/dashboard/profile" replace />;
};

const CustomerProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading account session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <WishlistProvider>
            <ToastContainer />
            <CommandPalette 
              isOpen={commandPaletteOpen} 
              onClose={() => setCommandPaletteOpen(false)} 
            />
            <DemoRoleSwitcher />
            <WishlistDrawer />
            <ApplianceComparisonDrawer />
            <AiConciergeModal />

            <Routes>
              
              {/* Public & Customer Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/appliances" element={<AppliancesCatalog />} />
                <Route path="/appliances/compare" element={<ApplianceComparisonPage />} />
                <Route path="/appliances/:id" element={<ApplianceDetail />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/support/login" element={<SupportLogin />} />

                {/* Protected Customer Portal Routes */}
                <Route path="/profile" element={<UniversalProfileRedirect />} />
                <Route path="/dashboard" element={<CustomerProtectedRoute><CustomerDashboard /></CustomerProtectedRoute>} />
                <Route path="/dashboard/rentals" element={<CustomerProtectedRoute><MyRentals /></CustomerProtectedRoute>} />
                <Route path="/dashboard/rentals/:id" element={<CustomerProtectedRoute><RentalTracker /></CustomerProtectedRoute>} />
                <Route path="/dashboard/payments" element={<CustomerProtectedRoute><CustomerPayments /></CustomerProtectedRoute>} />
                <Route path="/dashboard/profile" element={<CustomerProtectedRoute><CustomerProfile /></CustomerProtectedRoute>} />
                <Route path="/dashboard/reviews" element={<CustomerProtectedRoute><CustomerReviews /></CustomerProtectedRoute>} />
                <Route path="/dashboard/recommendations" element={<CustomerProtectedRoute><SmartRecommendations /></CustomerProtectedRoute>} />
              </Route>

              {/* Admin Portal Layout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="appliances" element={<AdminAppliances />} />
                <Route path="rentals" element={<AdminRentals />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="returns" element={<AdminReturns />} />
                <Route path="maintenance" element={<AdminMaintenance />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="ai-insights" element={<AdminAiInsights />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>

              {/* Support Portal Layout */}
              <Route path="/support" element={<SupportLayout />}>
                <Route index element={<Navigate to="/support/dashboard" replace />} />
                <Route path="dashboard" element={<SupportDashboard />} />
                <Route path="tickets" element={<SupportTickets />} />
                <Route path="complaints" element={<SupportComplaints />} />
                <Route path="moderation" element={<ReviewModeration />} />
                <Route path="reviews" element={<ReviewModeration />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </WishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
