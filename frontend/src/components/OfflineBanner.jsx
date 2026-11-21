import React, { useState, useEffect } from "react";

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="alert alert-warning d-flex align-items-center justify-content-between mb-3"
      role="alert"
      style={{ borderRadius: "8px" }}
    >
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-wifi-off"></i>
        <span>
          <strong>You are offline.</strong> Viewing cached data — changes will sync once connection returns.
        </span>
      </div>
    </div>
  );
};

export default OfflineBanner;
