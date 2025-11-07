// src/components/Layout.jsx
import React from "react";
import Header from "./adminDashbord";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main style={{ padding: "20px" }}>{children}</main>

      <div className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1>Hiiii</h1>
          </div>
          <div className="header-right">
            <div className="notification-bell">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </div>
          </div>
        </header>

      </div>
    </div>
    



    
  );
}

export default Layout;
