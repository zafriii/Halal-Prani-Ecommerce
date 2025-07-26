import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegUser, FaCog, FaClipboardList, FaDownload, FaMapMarkerAlt, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Dashboard.css'; 
import { useAuth } from '../../store/Auth'; 
import { IoIosArrowForward } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";

function Dashsidelink() {


 const { LogoutUser, user, isLoggedin } = useAuth(); 

  const handleLogout = () => {
    LogoutUser();
  };

  return (
    <>

    <div className="dashboard-sidebar">
          <div className="sidebar-user-info">
            <FaUserCircle  className="user-avatar-icon" size={130}/>
            <p className="user-name">{user?.username}</p>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <NavLink to="/my-account" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  <FaCog size={16} /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-account/orders" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  <FaClipboardList size={16} /> Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-account/downloads" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  <FaDownload size={16} /> Downloads
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-account/edit-address" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  <FaMapMarkerAlt size={16} /> Addresses
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-account/edit-account" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  <FaUserEdit size={16} /> Account details
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="sidebar-link logout-btn">
                  <FaSignOutAlt size={16} /> Log out
                </button>
              </li>
            </ul>
          </nav>
        </div>
    </>
  )
}

export default Dashsidelink