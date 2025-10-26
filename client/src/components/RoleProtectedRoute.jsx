import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin, Result, Button } from 'antd';
import { ExclamationCircleOutlined, HomeOutlined } from '@ant-design/icons';

const RoleProtectedRoute = ({ children, requiredRole, fallbackPath }) => {
  const { isAuthenticated, isLoading, userRole, isAdmin, isUser } = useAuth();
  const location = useLocation();
  
  console.log('RoleProtectedRoute - requiredRole:', requiredRole);
  console.log('RoleProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('RoleProtectedRoute - userRole:', userRole);
  console.log('RoleProtectedRoute - isAdmin:', isAdmin);
  console.log('RoleProtectedRoute - isUser:', isUser);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // If not authenticated, redirect to appropriate login page
  if (!isAuthenticated) {
    const isAdminRoute = location.pathname.startsWith('/admin');
    const loginPath = isAdminRoute ? '/admin-login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  const hasRequiredRole = () => {
    if (requiredRole === 'admin') {
      console.log('Checking admin role - isAdmin:', isAdmin);
      return isAdmin;
    } else if (requiredRole === 'user') {
      console.log('Checking user role - isUser:', isUser);
      return isUser;
    }
    console.log('Unknown required role:', requiredRole);
    return false;
  };

  // If authenticated but doesn't have required role
  const hasRole = hasRequiredRole();
  console.log('hasRequiredRole result:', hasRole);
  
  if (!hasRole) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}>
        <Result
          status="403"
          icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
          title="Access Denied"
          subTitle={`You don't have permission to access this page. This area is restricted to ${requiredRole}s only.`}
          extra={[
            <Button 
              type="primary" 
              key="home" 
              icon={<HomeOutlined />}
              onClick={() => window.location.href = fallbackPath || '/'}
            >
              Go to Home
            </Button>,
            <Button 
              key="back" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          ]}
        />
      </div>
    );
  }

  // If authenticated and has required role, render the protected component
  return children;
};

export default RoleProtectedRoute;
