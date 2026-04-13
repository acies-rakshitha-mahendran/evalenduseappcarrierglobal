import React from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { BuildApp } from "./builder/BuildApp";
import { PresentApp } from "./present/PresentApp";
import { ConfigBootstrapper } from "./ConfigBootstrapper";
import { BootstrapProvider } from "./BootstrapContext";

const TopNav: React.FC = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const isBuild = loc.pathname.startsWith("/build");
  const isPresent = loc.pathname.startsWith("/present");

  return (
    <header className="top-nav">
      <div style={{ fontWeight: 600, letterSpacing: "0.12em", fontSize: 13 }}>
        End-Use App Designer
      </div>
      <div className="nav-tabs">
        <button
          className={`nav-tab ${isBuild ? "active" : ""}`}
          onClick={() => navigate("/build")}
        >
          Build
        </button>
        <button
          className={`nav-tab ${isPresent ? "active" : ""}`}
          onClick={() => navigate("/present")}
        >
          Preview
        </button>
      </div>
      <div style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
        <Link to="/build" style={{ color: "inherit", textDecoration: "none" }}>
          ABC Beverage Co.
        </Link>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <BootstrapProvider>
      <ConfigBootstrapper>
        <div className="app-root">
          <div className="build-shell">
            <TopNav />
            <Routes>
              <Route path="/build" element={<BuildApp />} />
              <Route path="/present" element={<PresentApp />} />
              <Route path="*" element={<BuildApp />} />
            </Routes>
          </div>
        </div>
      </ConfigBootstrapper>
    </BootstrapProvider>
  );
};

export default App;
