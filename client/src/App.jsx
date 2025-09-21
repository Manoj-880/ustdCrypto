import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/startingPages/loginPage";
import AdminLogin from "./pages/startingPages/adminLogin";
import UserLayout from "./pages/pageLayouts/userLayout";
import AdminLayout from "./pages/pageLayouts/adminLayout";
import Register from "./pages/startingPages/register";

function App() {

  return (
    <AuthProvider>
      <div className="app col-sm-12">
        <Router>
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;