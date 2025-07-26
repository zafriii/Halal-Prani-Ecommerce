import React, { useEffect, useState } from 'react';
import '../styles/Login_Signup.css';
import { IoIosArrowForward } from "react-icons/io";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Footer from '../Footer';

function Login_Signup() {
  const [activeTab, setActiveTab] = useState('login');

  useEffect (() => {
    document.title = 'My account - Halal Prani'
  }, []) 

  return (

    <>
    <div className="account-page">
      <nav className="account-navbar">
        <div className="container">
          <a href="/" className="home-link">Home</a>
          <span className="account-icon"><IoIosArrowForward size={12} /></span>
          <span className="current-page">My account</span>
        </div>
      </nav>

      <div className="account-container">
        <h1 className="account-title">My Account</h1>

        <div className="login-register-tabs">
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            LOGIN
          </button>
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            REGISTER
          </button>
        </div>

        <div className="forms-container">
          {activeTab === 'login' && <LoginForm />}
          {activeTab === 'register' && <RegisterForm />}
        </div>
      </div>
    </div>

    <Footer/>

    </>
  );
}

export default Login_Signup;
