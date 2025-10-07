import { useEffect, useState } from "react";
import { FiDatabase, FiHome, FiMail, FiUser } from "react-icons/fi";

import SideBar from "../SideBar/SideBar";
import "./DashboardComp.scss";
import { LOCAL_STORAGE_KEYS } from "../../config";
import { useCache, useCachedState } from "../../context/CacheContext";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard({ children }) {
  const sideBarItems = [
    { id: 1, label: "Home", href: "/home", icon: <FiHome /> },
    { id: 3, label: "Emails", href: "/emails", icon: <FiMail /> },
    { id: 4, label: "Dataset", href: "/dataset", icon: <FiDatabase /> },
  ];
  const [collapsed, set_collapsed] = useCachedState(LOCAL_STORAGE_KEYS.sidebar_open, false);

  return (
    <div className={`dashboard_root ${collapsed ? "collapsed" : ""}`}>
      <SideBar
        sideBarItems={sideBarItems}
        collapsed={collapsed}
        setCollapsed={set_collapsed}
      />
      <div className={`content_root sidebar_${collapsed ? "collapsed" : ""}`}>

        {children}
      </div>
    </div>
  );
}
