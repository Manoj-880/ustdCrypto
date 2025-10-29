/**
 * Main Application Component - USDT Investment Platform
 * 
 * This is the root component of the React application that sets up the entire
 * application structure including routing, authentication, and global configurations.
 * 
 * Key Features:
 * - React Router setup with protected routes
 * - Authentication context provider
 * - Toast notifications system
 * - Role-based access control
 * - Static website and application routes
 * 
 * Route Structure:
 * - Static Routes: Public website pages (home, about, plans, etc.)
 * - Authentication Routes: Login, register, email verification
 * - Protected User Routes: Main application for regular users
 * - Protected Admin Routes: Administrative dashboard
 * - Public Legal Routes: Terms, privacy policy, risk disclaimer
 * 
 * @author USDT Platform Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import LoginPage from "./pages/startingPages/loginPage";
import AdminLogin from "./pages/startingPages/adminLogin";
import EmailVerification from "./pages/startingPages/emailVerification";
import UserLayout from "./pages/pageLayouts/userLayout";
import AdminLayout from "./pages/pageLayouts/adminLayout";
import Register from "./pages/startingPages/register";
import StaticLayout from "./pages/pageLayouts/StaticLayout";
import HomePage from "./pages/static/HomePage";
import AboutPage from "./pages/static/AboutPage";
import WhyJoinPage from "./pages/static/WhyJoinPage";
import OurPlansPage from "./pages/static/OurPlansPage";
import HowToUsePage from "./pages/static/HowToUsePage";
import ContactPage from "./pages/static/ContactPage";
import Terms from "./pages/userPages/terms";
import PrivacyPolicy from "./pages/userPages/privacyPolicy";
import RiskDisclaimer from "./pages/static/riskDisclaimer";
import NotFoundPage from "./pages/static/NotFoundPage";

/**
 * Main App Component
 * 
 * This component serves as the root of the application and handles:
 * - Global scroll behavior (scroll to top on route changes)
 * - Authentication context wrapping
 * - Toast notification configuration
 * - Route definitions and protection
 * - Fallback routing for unmatched paths
 * 
 * Authentication Flow:
 * - AuthProvider wraps the entire app to provide authentication state
 * - RoleProtectedRoute components protect admin and user routes
 * - Unauthenticated users are redirected to appropriate login pages
 * 
 * Route Protection:
 * - Static routes: Publicly accessible
 * - Authentication routes: Accessible to unauthenticated users
 * - User app routes: Protected by 'user' role requirement
 * - Admin routes: Protected by 'admin' role requirement
 * 
 * @returns {JSX.Element} The complete application structure
 */
function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthProvider>
      <div className="app">
        <Router>
          <ScrollToTop />
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          <Routes>
            <Route path="/" element={<StaticLayout />}>
              <Route index element={<HomePage />} />
              <Route path="why-join" element={<WhyJoinPage />} />
              <Route path="our-plans" element={<OurPlansPage />} />
              <Route path="how-to-use" element={<HowToUsePage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/risk-disclaimer" element={<RiskDisclaimer />} />

            <Route 
              path="/app/*" 
              element={
                <RoleProtectedRoute requiredRole="user" fallbackPath="/login">
                  <UserLayout />
                </RoleProtectedRoute>
              } 
            />

            <Route 
              path="/admin/*" 
              element={
                <RoleProtectedRoute requiredRole="admin" fallbackPath="/admin-login">
                  <AdminLayout />
                </RoleProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;