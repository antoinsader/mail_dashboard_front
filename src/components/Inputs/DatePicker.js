import { useState } from "react";
import "./Inputs.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerComp({
  value,
  onChange,
  label = "Pick a date",
  width,
  min,
  max,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="date_picker_wrapper input-wrapper " style={{ width }}>
      {label && <label className="input-label">{label}</label>}

      <div className={`input-field ${focused ? "focused" : ""}`}>
        <DatePicker
          selected={value}
          onChange={(date) => onChange(date)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          dateFormat="dd/MM/yyyy"
          minDate={min}
          maxDate={max}
          placeholderText={"dd/MM/yyyy"}
          
          className="custom_date_input"
          popperClassName="custom_date_popper"
          
        />
        {/* 
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
         
          min={min}
          max={max}
        /> */}
      </div>
    </div>
  );
}
