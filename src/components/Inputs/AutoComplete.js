import React, { useState } from "react";
import "./Inputs.scss";

export default function AutocompleteInput({ label, options, value, onChange, width, error, cls_root }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleChange = (val) => {
    onChange(val);
    if (val) {
      setFilteredOptions(options.filter((o) => o.toLowerCase().includes(val.toLowerCase())));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (val) => {
    onChange(val);
    setShowDropdown(false);
  };

  return (
    <div  className={`input-wrapper autocomplete_wrapper ${cls_root} ${error ? "error" : ""}`} style={{width}}>
      {label && <label className="input-label">{label}</label>}
      <input
        type="text"
        className="input-field"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        onFocus={() => value && setShowDropdown(true)}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="autocomplete_list">
          {filteredOptions.map((o, i) => (
            <li key={i} onClick={() => handleSelect(o)}>
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
