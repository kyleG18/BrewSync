import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        <span className="text-muted small">BrewSync POS • Inventory System</span>
        <span className="text-muted small">
          Status: <span className="text-success fw-bold">Operational</span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
