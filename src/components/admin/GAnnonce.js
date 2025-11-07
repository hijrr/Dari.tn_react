// src/components/Layout.jsx
import React from "react";
import Header from "./adminDashbord";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
}

export default Layout;
