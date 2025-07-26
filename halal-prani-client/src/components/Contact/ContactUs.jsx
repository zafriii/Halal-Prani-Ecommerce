import React, { useEffect, useState } from 'react';
import '../styles/ContactUs.css';
import { GiRotaryPhone } from "react-icons/gi";
import { RiInfoCardLine } from "react-icons/ri";
import { FaArrowLeft } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import Footer from '../Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState(null); 

  useEffect(() => {
    document.title = 'Contact Us - Halal Prani';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const token = localStorage.getItem('token'); 

    if (!token) {
      setStatus({ type: 'error', message: 'You must be logged in to contact us.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Your message is sent' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        const data = await response.json();
        setStatus({ type: 'error', message: data.message || 'Failed to send message.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Try again later.' });
    }
   }

  return (
    <>
      <div className="contact-page">

        <div className="contact-top">
          <div className="contact-text">
            <NavLink to="/" className='go-back'>
              <FaArrowLeft /> Go back to home page
            </NavLink>

            <h2>Contact Us</h2>

            <div className="contact-us-texts">
              <p>Need a hand? Or a high five?</p>
              <p>Here's how to reach us.</p>
            </div>

            <div className="info-block">
              <p className='info-block1'><GiRotaryPhone size={35} className='info-icon' /> 02222 285949</p>
              <p className='info-block2'><RiInfoCardLine size={35} className='info-icon' /> info@halalprani.com</p>
            </div>
          </div>

          <div className="contact-image">
            <img src="/images/contact.png" alt="Contact" />
          </div>
        </div>

        <div className="contact-middle">
          <div className="contact-info">
            <h2>Connect With Us</h2>
            <p>Please fill out this form to</p>
            <p>help us understand you</p>
            <p>better and cater to your needs.</p>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
            {status && (
              <p className={status.type === 'success' ? 'success-msg' : 'error-msg'}>
                {status.message}
              </p>
            )}
          </div>
        </div>

        <div className="contact-map">
          <h2>Our Location</h2>
          <iframe
            title="HalalPrani Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.783706771809!2d90.41518407577278!3d23.73839808904308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a1cb2c05ef%3A0x38a74fc8c3315ec0!2sKhawaja%20Tower!5e0!3m2!1sen!2sbd!4v1720267452805!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ContactUs;
