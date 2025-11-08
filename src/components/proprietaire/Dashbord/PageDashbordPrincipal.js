import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import Annonces3Dernier from './Annonces3Dernier';
import AllAnnonces from '../Annonces/Allannonces';
import './Dashboard.css';
import Offres from '../Ofrres/offre';
import GestionDemandes from '../gestiondemandeclient/GestionDemandes';

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
        case "clients":
        return <GestionDemandes/>;
      default:
        return (
          <>
            <DashboardHeader />
            <StatsCards />
            
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