import React from "react";
import "./Badge.css";

const Badge = ({
  text,
  variant = "success",
  dot = false,
  className = ""
}) => {
  const badgeClasses = [
    "badge",
    `badge-${variant}`,
    dot ? "badge-with-dot" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <span className={badgeClasses}>
      {dot && <span className="badge-dot" aria-hidden="true"></span>}
      {text}
    </span>
  );
};

export default Badge;
