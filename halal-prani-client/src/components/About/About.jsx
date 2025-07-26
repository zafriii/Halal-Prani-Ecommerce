import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/About.css';
import { FaArrowLeft } from "react-icons/fa6";
import Footer from '../Footer';

function About() {

useEffect (() => {
  document.title = 'About Us - Halal Prani'
}, []) 

  return (
    <>
    <div className="about-page">
      <section className="about-section">    
        <div className="about-text">
            <NavLink to="/" className='go-back'>
            <FaArrowLeft /> Go back to home page
            </NavLink>
          <h2>Our Story</h2>
          <p>
            Halal Prani a simple dream to create a haven for meat lovers where premium quality meets personalized attention.
            Fueled by a lifelong love affair with the art of butchery, set out to establish a shop that would redefine the standard
            for meat excellence in our community.
          </p>
        </div>
        <div className="about-image">
          <img src="/images/our-story.png" alt="Our Story" />
        </div>
      </section>
      <section className="about-section reverse">
        <div className="about-text">
          <h2>Our Products</h2>
          <p>
            At Halal Prani, we pride ourselves on offering a wide range of high-quality halal meats to cater to all your culinary needs.
            From premium cuts of beef to succulent poultry, our selection is meticulously curated to ensure freshness, taste,
            and adherence to halal standards.
          </p>
        </div>
        <div className="about-image">
          <img src="/images/our-products.png" alt="Our Products" />
        </div>
      </section>
      <section className="about-section">
        <div className="about-text">
          <h2>Let's Visit Our Firm</h2>
          <p>
            Halal Prani is more than just a meat shop – it's a testament to our commitment to providing the finest halal meats
            with integrity and excellence. Founded on the principles of quality, transparency, and community, our firm is dedicated
            to serving customers with the utmost respect and care. With a focus on halal certification and ethical sourcing practices,
            we strive to uphold the highest standards of quality and trust in everything we do. Welcome to Halal Prani, where your
            satisfaction is our top priority.
          </p>
          <NavLink to="/contact-us" className="about-button">Contact Us</NavLink>
        </div>
        <div className="about-image">
          <img src="/images/visit-firm.png" alt="Our Firm" />
        </div>
      </section>
      <section className="about-section">
        <div className="about-text">
          <img className='statistic' src="/images/statistics-sec.png" alt="Statistics" />
        </div>
        <div className="about-image">
          <h2>Statistics</h2>
          <img className='statistic' src="/images/statistics.png" alt="Statistics" />
        </div>
      </section>
      <section className="about-section">
        <div className="about-text">
          <h2>Need help?</h2>
          <p>
            At Halal Prani, we understand that you may have questions about our products, services, and practices.
            That's why we've compiled this comprehensive FAQ section to address some of the most common inquiries we receive.
          </p>
          <NavLink to="/faq" className="about-button">FAQ Page</NavLink>
        </div>
        <div className="about-image">
          <img src="/images/faq.png" alt="Need Help" />
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
}

export default About;
