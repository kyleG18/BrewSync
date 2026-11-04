import React from "react";
import "./Select.css";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  className = ""
}) => {
  const hasError = !!error;
  const selectClasses = [
    "form-select",
    hasError ? "is-invalid" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className="select-container mb-3">
      {label && (
        <label className="form-select-label" htmlFor={name}>
          {label}
        </label>
      )}
      <select
        id={name}
        className={selectClasses}
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="invalid-feedback">{error}</div>
      )}
    </div>
  );
};

export default Select;
