import React from "react";
import "./Popup.scss";

export default function Popup({
  title = "Popup Title",
  isVisible = false,
  closePopup,
  content,
  component: Component,
  componentProps = {},
  popupContainerStyle = {},
  children,
}) {
  if (!isVisible) return null;

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div
        className="popup-content"
        style={popupContainerStyle}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="popup_header">
          <h3 className="popup_title">{title}</h3>
          <button className="close-btn" onClick={closePopup}>
            ✕
          </button>
        </div>

        <div className="popup_container">
          {children ? (
            children
          ) : Component ? (
            <Component {...componentProps} closePopup={closePopup} />
          ) : (
            <>{content}</>
          )}
        </div>
      </div>
    </div>
  );
}
