import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import "./SideBar.scss";

export default function SideBar({ sideBarItems, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user_google, user_guest } = useAuth();

  const nav = (href) => {
    navigate(href);
  };

  return (
    <aside className={`sidebar_root ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar_header">
        {!collapsed ? <h2> My email dashboard</h2> : ""}
        <button
          className="collapse_btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      <ul className="sidebar_menu">
        {sideBarItems.map((ele) => (
          <li
            key={ele.id}
            onClick={() => nav(ele.href)}
            className={location.pathname === ele.href ? "active" : ""}
            title={collapsed ? ele.label : ""}
          >
            <span className="icon"> {ele.icon}</span>
            {!collapsed && <span className="label"> {ele.label}</span>}
          </li>
        ))}
      </ul>

      {(user_google || user_guest) && (
        <div className="sidebar_footer">
          <li onClick={logout} title={collapsed ? "Logout" : ""}>
            <FiLogOut className="icon" />
            {!collapsed && <span className="label">Logout</span>}
          </li>
        </div>
      )}
    </aside>
  );
}
