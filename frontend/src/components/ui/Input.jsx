import React from "react";
import "./Input.css";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
  required,
  className = ""
}) => {
  const hasError = !!error;
  const inputClasses = [
    "form-control",
    hasError ? "is-invalid" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className="input-container position-relative mb-3">
      {icon && (
        <i className={`bi ${icon} input-icon`} aria-hidden="true"></i>
      )}
      <input
        type={type}
        className={inputClasses}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        required={required}
        disabled={false}
        autoComplete="off"
      />
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      {hasError && (
        <div className="invalid-feedback">{error}</div>
      )}
    </div>
  );
};

export default Input;
