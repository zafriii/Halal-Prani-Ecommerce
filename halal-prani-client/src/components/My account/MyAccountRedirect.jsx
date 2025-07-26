import React from 'react'
import { useAuth } from '../../store/Auth';
import Dashboard from './Dashboard';
import Login_Signup from '../Login-Signup/Login_Signup';

function MyAccountRedirect() {

const { isLoggedin } = useAuth();

  return isLoggedin ? <Dashboard /> : <Login_Signup />;
  
}

export default MyAccountRedirect