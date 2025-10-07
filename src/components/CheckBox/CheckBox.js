import React, { useState } from "react";
import "./CheckBox.scss";

const Checkbox = ({ label, onChange, defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const toggle = () => {
    setChecked(!checked);
    if (onChange) onChange(!checked);
  };

  return (
    <label className="custom-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={toggle}
      />
      <span className="checkmark" />
      <span className="label-text">{label}</span>
    </label>
  );
};

export default Checkbox;
