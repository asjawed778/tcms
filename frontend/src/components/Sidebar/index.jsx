import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import { FaHome, FaUserGraduate, FaCog, FaSignOutAlt, FaAngleDown, FaAngleRight, FaUserPlus, FaList } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/reducers/authReducer";

const Sidebar = () => {

  const [studentMenuOpen, setStudentMenuOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout());
    navigate("/", {replace: true});
  }

  return (
    <div className="fixed left-0 top-16 w-60 h-[calc(100vh-64px)] flex flex-col space-y-10  bg-white text-black p-4  shadow-lg  overflow-y-auto ">
      <nav className="mt-5">
        <h3 className="text-gray-600 mb-2 font-semibold">Overview</h3>
        <SidebarItem name="Dashboard" to="/dashboard" icon={<FaHome />} />
        <div>
          <button
            className="flex items-center justify-between w-full py-2 px-3 text-gray-700 font-bold hover:bg-gray-200 rounded-lg cursor-pointer"
            onClick={() => setStudentMenuOpen(!studentMenuOpen)}
          >
          <div className="flex items-center gap-3 ">
            <FaUserGraduate />
            <span>Student</span>
          </div>
          {studentMenuOpen ? <FaAngleDown /> : <FaAngleRight />}
          </button>
          {studentMenuOpen && (
            <div className="ml-6 mt-2 text-gray-700 font-bold">
              <SidebarItem name="Add Student" to="/addStudent" icon={<FaUserPlus />} />
              <SidebarItem name="Student List" to="/studentList" icon={<FaList />} />
            </div>
          )}
        </div>
      </nav>
      <div className="mt-15">
      <h3 className="text-gray-600 mt-4 mb-2 font-semibold">Settings</h3>
      <div className="flex flex-col mt-2">
        <SidebarItem name="Settings" to="/setting" icon={<FaCog />} />
        <SidebarItem name="Logout" to="#" onClick={handleLogout} icon={<FaSignOutAlt />} className="text-red-400" />
      </div>
      </div>
    </div>
  );
};
export default Sidebar;


