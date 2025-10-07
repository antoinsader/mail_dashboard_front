import React from "react";
import "./Inputs.scss";

const TextInput = ({ label, type = "text", value, onChange, placeholder, error, width, cls_root

  ,required,
  onBlur

 }) => {
  return (
    <div className={`input-wrapper ${cls_root} ${error ? "error" : ""}`} style={{width}}>
      {label && <label className="input-label">{label}  {required && <span className="required-star">*</span>}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        className="input-field"
        onBlur={onBlur}

      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default TextInput;
