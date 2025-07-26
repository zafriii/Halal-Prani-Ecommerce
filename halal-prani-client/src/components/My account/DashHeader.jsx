import React from 'react'
import { NavLink } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";

function DashHeader() {
  return (
     <nav className="dashboard-header-banner">
            <div className="container">
              <a href="/" className="home-link">Home</a>
              <span className="account-icon"><IoIosArrowForward size={12} /></span>
              <span className="current-page">My account</span>
            </div>
     </nav>
  )
}

export default DashHeader