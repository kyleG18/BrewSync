import React from "react";
import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  className = ""
}) => {
  const baseClasses = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const widthClass = fullWidth ? "w-100" : "";

  return (
    <button
      type={type}
      className={[baseClasses, variantClass, sizeClass, widthClass, className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
