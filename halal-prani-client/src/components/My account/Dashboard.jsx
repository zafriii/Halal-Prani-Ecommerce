import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Dashboard.css'; 
import { useAuth } from '../../store/Auth'; 
import Dashsidelink from './Dashsidelink';
import DashHeader from './DashHeader';
import Footer from '../Footer'

const Dashboard = () => {
  const { LogoutUser, user, isLoggedin } = useAuth(); 

  const handleLogout = () => {
    LogoutUser();
  };

  useEffect(() => {
    document.title = 'Dashboard - Halal Prani'
  },[])

  return (

    <>
    <div className="dashboard-page">    
       <DashHeader/>
      <div className="dashboard-content-area">             
        <Dashsidelink/> 
             
        <div className="dashboard-main-content">         
          <p className="welcome-text">
            Hello, {user?.username} (Want to <button className="logout-inline-btn" onClick={handleLogout}>Log out ?</button>)
          </p>
          <p className="dashboard-description">
            From your account dashboard you can view your <NavLink to="/my-account/orders">recent orders</NavLink>, manage your <NavLink to="/my-account/edit-address">shipping and billing addresses</NavLink>, and <NavLink to="/my-account/edit-account">edit your password and account details</NavLink>.
          </p>
        </div>

      </div>
    </div>

    <Footer/>
    </>
  );
};

export default Dashboard;
