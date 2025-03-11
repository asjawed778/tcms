import React from "react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ name, icon, to, className, onClick }) => {
  return (
    <NavLink 
    to={to !== "#" ? to : ""}
    onClick={onClick} 
    className={({isActive}) => `flex items-center gap-3 ${isActive ? "text-primary" : "text-gray-700"} hover:bg-gray-200 p-3 rounded-lg cursor-pointer  ${className}`}>
      <span className="text-lg">{icon}</span>
      <span className=" font-bold">{name}</span>
    </NavLink>
  );
};

export default SidebarItem;
