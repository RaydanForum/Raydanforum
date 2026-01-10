import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import BriefingsPage from './pages/BriefingsPage';
import BriefingDetailPage from './pages/BriefingDetailPage';
import MembershipPage from './pages/MembershipPage';
import AboutPage from './pages/AboutPage';

import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import HomeContentPage from './pages/admin/HomeContentPage';
import SiteSettingsPage from './pages/admin/SiteSettingsPage';
import AdminBriefingsPage from './pages/admin/BriefingsPage';
import AdminActivitiesPage from './pages/admin/ActivitiesPage';
import TeamPage from './pages/admin/TeamPage';
import ValuesPage from './pages/admin/ValuesPage';
import MembershipApplicationsPage from './pages/admin/MembershipApplicationsPage';
import BusinessInfoPage from './pages/admin/BusinessInfoPage';

function AppContent() {
  const { language } = useLanguage();

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/home-content"
          element={
            <ProtectedRoute>
              <HomeContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <SiteSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/briefings"
          element={
            <ProtectedRoute>
              <AdminBriefingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/activities"
          element={
            <ProtectedRoute>
              <AdminActivitiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/values"
          element={
            <ProtectedRoute>
              <ValuesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/membership"
          element={
            <ProtectedRoute>
              <MembershipApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/business-info"
          element={
            <ProtectedRoute>
              <BusinessInfoPage />
            </ProtectedRoute>
          }
        />

        {/* Public Routes with Layout */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Header />
              <main>
                <HomePage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/activities"
          element={
            <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Header />
              <main>
                <ActivitiesPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/activities/:id"
          element={
            <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Header />
              <main>
                <ActivityDetailPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/briefings"
          element={
            <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Header />
              <main>
                <BriefingsPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/briefings/:id"
          element={
            <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Header />
              <main>
                <BriefingDetailPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/membership"
          element={
            <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Header />
              <main>
                <MembershipPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <Header />
              <main>
                <AboutPage />
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
