// Button.jsx
import React from "react";

const Button = ({
  children,
  onClick,
  loading,
  btnClass,
  width,
  variant = "primary",
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      className={`btn ${btnClass} ${variant}`}
      style={{ width: width ? width : "auto" }}
      onClick={loading && !disabled ? () => {} : () => onClick()}
      disabled={loading || disabled }
      type={type}
    >
      {loading && <span className="spinner"> </span>}
      {children}
    </button>
  );
};

export default Button;
