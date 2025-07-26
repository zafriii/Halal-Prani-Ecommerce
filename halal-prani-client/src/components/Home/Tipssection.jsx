import React, { useEffect, useState } from 'react';
import '../styles/Tipssection.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Tipssection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState(null); 

  useEffect(() => {
    AOS.init({ duration: 1000 });
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
      setStatus({ type: 'error', message: 'You must be logged in to submit tips.' });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Thanks for your feedback!' });
        setFormData({ name: '', email: '', message: '' }); // reset form
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to submit.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Try again later.' });
    }
  };

  return (
    <div className="tips-form-container">
      <div className="form-video-container">

        <div className="form-section" data-aos='fade-right'>
          <h2>Your Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your name</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Your email</label>
              <input
                type="email"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Your message (optional)</label>
              <textarea
                className="form-input textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>

          {status && (
            <p className={status.type === 'success' ? 'success-msg' : 'error-msg'}>
              {status.message}
            </p>
          )}
        </div>

        <div className="video-section" data-aos='fade-right'>
          <h2>More tips</h2>
          <iframe
            src="https://www.youtube.com/embed/3dDafCFtmjA?si=VgZ-F6T00kRmNYZS"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default Tipssection;
