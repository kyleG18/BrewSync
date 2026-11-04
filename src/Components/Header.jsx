import React from "react";

const Header = ({ user, onLogout }) => {
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const photoURL = user?.photoURL;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "#241F1C",
        borderBottom: "1px solid #3D322B",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        color: "#F5EBE0",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Brand logo & title */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4A2E19, #E88D39)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F5EBE0",
            fontSize: "1.1rem"
          }}
        >
          <i className="bi bi-cup-hot"></i>
        </div>
        <div>
          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#F5EBE0" }}>
            BrewSync POS
          </span>
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "0.7rem",
              backgroundColor: "rgba(42, 157, 143, 0.2)",
              color: "#2A9D8F",
              padding: "0.15rem 0.45rem",
              borderRadius: "999px",
              fontWeight: 600
            }}
          >
            Firebase Auth
          </span>
        </div>
      </div>

      {/* User profile & Sign Out */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "2px solid #E88D39",
                objectFit: "cover"
              }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#4A2E19",
                border: "2px solid #E88D39",
                color: "#F5EBE0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "0.85rem"
              }}
            >
              {initials}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#F5EBE0", lineHeight: 1.2 }}>
              {displayName}
            </span>
            {email && (
              <span style={{ fontSize: "0.72rem", color: "#9A8A7A", lineHeight: 1.2 }}>
                {email}
              </span>
            )}
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.45rem 0.9rem",
            backgroundColor: "rgba(220, 38, 38, 0.15)",
            color: "#f87171",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            borderRadius: "0.5rem",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.25)";
            e.currentTarget.style.borderColor = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.15)";
            e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.3)";
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
