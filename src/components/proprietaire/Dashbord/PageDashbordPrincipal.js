import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import Annonces3Dernier from './Annonces3Dernier';
import AllAnnonces from '../Annonces/Allannonces';
import './Dashboard.css';
import Offres from '../Ofrres/offre';

const PageDashbordPrincipal = () => {
  const [activeComponent, setActiveComponent] = useState("accueil");

  const renderComponent = () => {
    switch (activeComponent) {
      case "accueil":
        return (
          <>
            <DashboardHeader />
            <StatsCards />
            <Annonces3Dernier />
          </>
        );
      case "annonces":
        return <AllAnnonces />;
      case "offres":
        return <Offres/>;
      default:
        return (
          <>
            <DashboardHeader />
            <StatsCards />
            <Annonces3Dernier />
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar onMenuClick={setActiveComponent} />
      <div className="main-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default PageDashbordPrincipal;