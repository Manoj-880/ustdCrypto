import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminDashboard from "../adminPages/adminDashboard";
import AdminUsers from "../adminPages/adminUsers";
import AdminUserDetails from "../adminPages/adminUserDetails";
import AdminTransactions from "../adminPages/adminTransactions";
import AdminWithdrawRequests from "../adminPages/adminWithdrawRequests";
import AdminWallets from "../adminPages/adminWallets";
import AdminSideNav from "../adminPages/components/AdminSideNav";
import AdminHeader from "../adminPages/components/AdminHeader";
import "../../styles/layouts/adminLayout.css";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    // Check if mobile device
    const isMobile = window.innerWidth <= 768;
    return isMobile; // Mobile starts collapsed, desktop/tablet starts open
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Auto-collapse on mobile, auto-expand on desktop/tablet
      if (mobile) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`admin-layout ${collapsed ? "collapsed" : ""} ${isMobile ? "mobile" : ""}`}>
      {/* Mobile backdrop */}
      {isMobile && !collapsed && (
        <div 
          className="mobile-backdrop" 
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <AdminSideNav collapsed={collapsed} isMobile={isMobile} />

      {/* Main */}
      <div className="admin-main col-sm-12">
        <AdminHeader 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          isMobile={isMobile} 
        />

        <div className="admin-content">
          {/* Nested Routes Rendering */}
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/user/:id" element={<AdminUserDetails />} />
            <Route path="/transactions" element={<AdminTransactions />} />
            <Route path="/withdraw-requests" element={<AdminWithdrawRequests />} />
            <Route path="/wallets" element={<AdminWallets />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;