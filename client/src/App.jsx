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
import HowToUsePage from "./pages/static/HowToUsePage";
import ContactPage from "./pages/static/ContactPage";
import Terms from "./pages/userPages/terms";
import PrivacyPolicy from "./pages/userPages/privacyPolicy";
import RiskDisclaimer from "./pages/static/riskDisclaimer";


function App() {
  // Scroll to top on route change
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
            {/* Static Website Routes */}
            <Route path="/" element={<StaticLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="how-to-use" element={<HowToUsePage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            
            {/* Public Terms and Privacy Policy Routes */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/risk-disclaimer" element={<RiskDisclaimer />} />

            {/* Protected User App Routes - Only accessible by users with 'user' role */}
            <Route 
              path="/app/*" 
              element={
                <RoleProtectedRoute requiredRole="user" fallbackPath="/login">
                  <UserLayout />
                </RoleProtectedRoute>
              } 
            />

            {/* Protected Admin Routes - Only accessible by users with 'admin' role */}
            <Route 
              path="/admin/*" 
              element={
                <RoleProtectedRoute requiredRole="admin" fallbackPath="/admin-login">
                  <AdminLayout />
                </RoleProtectedRoute>
              } 
            />

            {/* Fallback - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;