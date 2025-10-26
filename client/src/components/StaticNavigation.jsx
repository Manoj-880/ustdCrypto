import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu, Drawer } from 'antd';
import { 
  MenuOutlined, 
  CloseOutlined,
  LoginOutlined,
  UserOutlined
} from '@ant-design/icons';
import logo from '../assets/logo.svg';
import './StaticNavigation.css';

const StaticNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { key: '/', label: 'Home', path: '/' },
    { key: '/why-join', label: 'Why Join', path: '/why-join' },
    { key: '/our-plans', label: 'Our Plans', path: '/our-plans' },
    { key: '/how-to-use', label: 'How to Use', path: '/how-to-use' },
    { key: '/contact', label: 'Contact', path: '/contact' },
  ];

  // Debug: Log menu items
  console.log('Menu items:', menuItems);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="static-navigation">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
          <img src={logo} alt="SecureUSDT Logo" className="logo-image" />
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu-desktop">
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="desktop-menu"
            items={menuItems.map(item => ({
              key: item.key,
              label: (
                <Link to={item.path} className="nav-link">
                  {item.label}
                </Link>
              )
            }))}
          />
        </div>

        {/* Auth Buttons */}
        <div className="nav-auth">
          <Link to="/login">
            <Button type="text" className="nav-login-btn">
              <LoginOutlined />
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button type="primary" className="nav-register-btn">
              <UserOutlined />
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          icon={<MenuOutlined />}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="drawer-header" style={{ padding: '0', margin: '0' }}>
            <img src={logo} alt="SecureUSDT Logo" className="logo-image" style={{ width: '60px', height: '90px' }} />
          </div>
        }
        placement="right"
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
        className="mobile-drawer"
        closeIcon={<CloseOutlined />}
        headerStyle={{ 
          padding: '4px 24px', 
          minHeight: 'auto',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)',
          borderBottom: '1px solid rgba(0, 212, 170, 0.2)'
        }}
        bodyStyle={{ 
          padding: '4px 24px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)'
        }}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)'
        }}
      >
        <div className="mobile-menu">
          <Link
            to="/"
            className="mobile-nav-link"
            onClick={closeMobileMenu}
            style={{ 
              display: 'block !important', 
              marginBottom: '4px',
              backgroundColor: 'rgba(0,212,170,0.1)',
              border: '1px solid #00d4aa',
              padding: '10px 20px',
              borderRadius: '6px',
              color: '#ffffff !important',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              width: '100%',
              textAlign: 'left'
            }}
          >
            🏠 Home
          </Link>
          
          <Link
            to="/why-join"
            className="mobile-nav-link"
            onClick={closeMobileMenu}
            style={{ 
              display: 'block !important', 
              marginBottom: '4px',
              backgroundColor: 'rgba(0,212,170,0.1)',
              border: '1px solid #00d4aa',
              padding: '10px 20px',
              borderRadius: '6px',
              color: '#ffffff !important',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              width: '100%',
              textAlign: 'left'
            }}
          >
            💡 Why Join
          </Link>
          
          <Link
            to="/our-plans"
            className="mobile-nav-link"
            onClick={closeMobileMenu}
            style={{ 
              display: 'block !important', 
              marginBottom: '4px',
              backgroundColor: 'rgba(0,212,170,0.1)',
              border: '1px solid #00d4aa',
              padding: '10px 20px',
              borderRadius: '6px',
              color: '#ffffff !important',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              width: '100%',
              textAlign: 'left'
            }}
          >
            📋 Our Plans
          </Link>
          
          <Link
            to="/how-to-use"
            className="mobile-nav-link"
            onClick={closeMobileMenu}
            style={{ 
              display: 'block !important', 
              marginBottom: '4px',
              backgroundColor: 'rgba(0,212,170,0.1)',
              border: '1px solid #00d4aa',
              padding: '10px 20px',
              borderRadius: '6px',
              color: '#ffffff !important',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              width: '100%',
              textAlign: 'left'
            }}
          >
            📖 How to Use
          </Link>
          
          <Link
            to="/contact"
            className="mobile-nav-link"
            onClick={closeMobileMenu}
            style={{ 
              display: 'block !important', 
              marginBottom: '4px',
              backgroundColor: 'rgba(0,212,170,0.1)',
              border: '1px solid #00d4aa',
              padding: '10px 20px',
              borderRadius: '6px',
              color: '#ffffff !important',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              width: '100%',
              textAlign: 'left'
            }}
          >
            📞 Contact
          </Link>
          
          
          <div className="mobile-auth" style={{ marginTop: '8px', padding: '4px 0' }}>
            <Link to="/login" onClick={closeMobileMenu}>
              <Button 
                type="text" 
                className="mobile-login-btn" 
                block
                style={{
                  height: '36px',
                  fontSize: '15px',
                  marginBottom: '4px',
                  backgroundColor: 'rgba(0,212,170,0.1) !important',
                  border: '1px solid #00d4aa !important',
                  color: '#ffffff !important',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  fontWeight: '600'
                }}
              >
                <LoginOutlined />
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={closeMobileMenu}>
              <Button 
                type="primary" 
                className="mobile-register-btn" 
                block
                style={{
                  height: '36px',
                  fontSize: '15px',
                  backgroundColor: 'linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%) !important',
                  border: 'none !important',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  fontWeight: '600'
                }}
              >
                <UserOutlined />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default StaticNavigation;
