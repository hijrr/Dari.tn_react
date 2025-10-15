import React from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import Annonces3Dernier from './Annonces3Dernier'
import './Dashboard.css';

const PageDashbordPrincipal = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="main-content">
        <DashboardHeader />
        <StatsCards />
        < Annonces3Dernier/>
      </div>
    </div>
  );
};

export default PageDashbordPrincipal;