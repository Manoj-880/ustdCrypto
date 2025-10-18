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
    { key: '/about', label: 'About', path: '/about' },
    { key: '/how-to-use', label: 'How to Use', path: '/how-to-use' },
    { key: '/contact', label: 'Contact', path: '/contact' },
  ];

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
          <div className="drawer-header">
            <img src={logo} alt="SecureUSDT Logo" className="logo-image" />
          </div>
        }
        placement="right"
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
        className="mobile-drawer"
        closeIcon={<CloseOutlined />}
      >
        <div className="mobile-menu">
          {menuItems.map(item => (
            <Link
              key={item.key}
              to={item.path}
              className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="mobile-auth">
            <Link to="/login" onClick={closeMobileMenu}>
              <Button type="text" className="mobile-login-btn" block>
                <LoginOutlined />
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={closeMobileMenu}>
              <Button type="primary" className="mobile-register-btn" block>
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
