import React from "react";
import "./Card.css";

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = ""
}) => {
  const cardClasses = ["card", className].filter(Boolean).join(" ");

  return (
    <div className={cardClasses}>
      {title || subtitle ? (
        <div className="card-header">
          {title && <h5 className="card-title mb-1">{title}</h5>}
          {subtitle && <p className="card-subtitle text-muted mb-0">{subtitle}</p>}
        </div>
      ) : null}
      <div className="card-body">{children}</div>
      {footer ? (
        <div className="card-footer">{footer}</div>
      ) : null}
    </div>
  );
};

export default Card;
