import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Servicesection.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Servicesection() {


useEffect(() => {
AOS.init({ duration: 1000 });
}, []); 

  return (
    <div className="service-section">
      <div className="service-image-wrapper">
        <img
          src="/images/cooking-service.png"
          alt="Service 1"
          className="service-image"
          data-aos='fade-right'
        />
        <NavLink to="/services" className="service-link">
          More Info
        </NavLink>
      </div>

      <div className="service-image-wrapper">
        <img
          src="/images/butchery-service.png"
          alt="Service 2"
          className="service-image"
           data-aos='fade-left'
        />
        <NavLink to="/services" className="service-link">
          More Info
        </NavLink>
      </div>
    </div>
  );
}

export default Servicesection;
