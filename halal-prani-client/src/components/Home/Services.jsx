import React, { useEffect } from 'react';
import { FaCrown, FaShoppingCart, FaMobileAlt } from 'react-icons/fa';
import { PiChefHat } from 'react-icons/pi';
import '../styles/Services.css';
import { FaUserTie } from "react-icons/fa6";
import { BsCashStack } from "react-icons/bs";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = () => {


useEffect(() => {
AOS.init({ duration: 1000 });
}, []); 

  return (
    <div className="services-container" data-aos='fade-up'>
      <div className="header-section">
        <h3>Introducing</h3>
        <h2>Online ordering and delivery</h2>
        <h3>Services</h3>
      </div>

      <div className="main-content">
        <div className="left-services" data-aos='fade-up'>
          <div className="service-item">
            <div className="icon-text-group">
              <div className="icon-circle">
                <FaCrown size={24} color='white'/>
              </div>
              <div className="service-text">
                <strong>Royal Cook</strong>
                <p>Hire top cooks for gourmet culinary experiences.</p>
              </div>
            </div>
          </div>

          <div className="service-item">
            <div className="icon-text-group">
              <div className="icon-circle">
                <FaShoppingCart size={24} color='white'/>
              </div>
              <div className="service-text">
                <strong>Gourmet Selections</strong>
                <p>Buy top-quality cows, fresh meat, and organic chickens online.</p>
              </div>
            </div>
          </div>

          <div className="service-item">
            <div className="icon-text-group">
              <div className="icon-circle">
                <PiChefHat size={24} color='white'/>
              </div>
              <div className="service-text">
                <strong>Hire Butcher</strong>
                <p>Hire skilled butchers for custom cuts.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="center-image" data-aos='fade-up'>
          <div className="image-placeholder">
            <img src='/images/butcher-banner.png' alt='butcher'/>
          </div>
        </div>

        <div className="right-products" data-aos='fade-up'>
          <div className="product-item">
            <div className="icon-text-group">
              <div className="icon-circle">
                <FaMobileAlt size={24} color='white'/>
              </div>
              <div className="product-text">
                <strong>Online Payment</strong>
                <p>Safe, easy online transactions.</p>
              </div>
            </div>
          </div>

          <div className="product-item">
            <div className="icon-text-group">
              <div className="icon-circle">
                <BsCashStack size={24} color='white'/>
              </div>
              <div className="product-text">
                <strong>Cash on Delivery</strong>
                <p>Pay cash upon delivery of products.</p>
              </div>
            </div>
          </div>

          <div className="product-item">
            <div className="icon-text-group">
              <div className="icon-circle">
                <FaUserTie size={24} color='white'/>
              </div>
              <div className="product-text">
                <strong>24/7 online support</strong>
                <p>Get help anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;