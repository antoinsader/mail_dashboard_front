import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import "./Section.scss";
import { useCachedState } from "../../context/CacheContext";
export default function Section({ title, section_class="", section_key="section_general", children }) {
  const [open , setOpen] = useCachedState(section_key, true)

  const toggleOpen = () => setOpen(!open);

  return (
    <div className={`section ${section_class} `}>
      <div className="section_header" onClick={toggleOpen}>
        <h3>{title}</h3>
        {open ? (
          <FiChevronDown className="chevron" />
        ) : (
          <FiChevronUp className="chevron" />
        )}
      </div>
      <div className={`section_content ${open ? "open" : "closed"}`}>
        {children}
      </div>
    </div>
  );
}
