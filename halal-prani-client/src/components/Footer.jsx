import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import { TfiYoutube } from "react-icons/tfi";
import './styles/Footer.css';
import { useAuth } from '../store/Auth';


const Footer = () => {

const { user, isLoggedin } = useAuth();

 const [memberData, setMemberData] = useState(null);

 const fetchMemberData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/member', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.member) {
        setMemberData(data.member);
      } else {
        setMemberData(null);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

   useEffect(() => {
      if (isLoggedin) {
        fetchMemberData();
      }
    }, [isLoggedin]);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/images/halal-prani-logo.png" alt="Halal Prani" className="footer-logo" />
        
          <p className="footer-description">
            <span>Halal Prani</span> invites you to experience the
            pinnacle of halal excellence, where tradition
            meets quality. Join us in celebrating the art
            of butchery and the joy of good food.
          </p>
        </div>
        <div className="footer-links">
          <div className="links-column">
            <h3 className="links-header">INFORMATION</h3>
            <ul className="links-list">
              <li>Privacy Policy</li>
              <li>Terms & conditions</li>
              <li>
                <a href='/contact-us'>Contact Us</a>
              </li>
              <li>FAQ</li>
              {isLoggedin && (
              <li>
                <a href="/member">
                  {memberData ? 'Your Membership' : 'Be a Member'}
                </a>
              </li>
            )}
            </ul>
          </div>
          <div className="links-column">
            <h3 className="links-header">COMPANY</h3>
            <ul className="links-list">
              <li>
                <a href='/about-us'>About Us</a>
              </li>
             <li>
                <a href='/shop'>Shop</a>
              </li>
              <li>
                <a href='/contact-us'>Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-apps">
          <h3 className="links-header">DOWNLOAD APPS</h3>
          <div className="app-buttons">
            <img src="/images/google-medium.png" alt="Get on Google Play" className="app-button" />
            <img src="/images/aple-medium.png" alt="Download on the App Store" className="app-button" />
          </div>
        </div>
        <div className="footer-payments">
          <h3 className="links-header">WE ACCEPT PAYMENT</h3>
          <div className="payment-methods">
           
            <img src="/images/bkash.png" alt="bKash" className="payment-method" />
          
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <div className="copyright-content">
            © Designed & Developed by 88 Innovations Engineering Ltd.
            <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <TfiYoutube  className="social-icon" />
            </a>
            </div>
        </div>
        </div>
    </footer>
  );
};

export default Footer;