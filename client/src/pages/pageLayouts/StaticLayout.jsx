import React from 'react';
import { Outlet } from 'react-router-dom';
import StaticNavigation from '../../components/StaticNavigation';
import './StaticLayout.css';

const StaticLayout = () => {
  return (
    <div className="static-layout">
      <StaticNavigation />
      <main className="static-main">
        <Outlet />
      </main>
    </div>
  );
};

export default StaticLayout;
