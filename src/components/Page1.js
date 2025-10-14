import React from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import AnnoncesGrid from './AnnoncesGrid';
import './Dashboard.css';

const Page1 = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="main-content">
        <DashboardHeader />
        <StatsCards />
        <AnnoncesGrid />
      </div>
    </div>
  );
};

export default Page1;