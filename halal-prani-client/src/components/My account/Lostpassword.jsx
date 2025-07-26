import React, { useState } from 'react';
import '../styles/LostReset.css';
import DashHeader from './DashHeader';
import { BsCheckLg } from "react-icons/bs";
import Footer from '../Footer';

const Lostpassword = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/lost-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          'Password reset email has been sent. A password reset email has been sent to the email address on file for your account, but may take several minutes to show up in your inbox. Please wait at least 10 minutes before attempting another reset.'
        );
        setFormData({ email: '' }); 
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <DashHeader />
      <div className="lost-password-container">
        {message ? (
         
          <div className="success-message-wrapper">
            <div className="success-banner">
              <div className="checkmark-area">
                <span className="checkmark">
                  <BsCheckLg />
                </span>
              </div>
              <div className="message-text">
                Password reset link has been sent.
              </div>
            </div>
            <p className="success-details">
              A password reset link has been sent to the email address on file for your account, but may take several minutes to show up in your inbox. Please wait at least 10 minutes before attempting another reset.
            </p>
          </div>
        ) : (
         
          <>
            <p>Lost your password? Please enter your email address. You will receive a link to create a new password via email.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Email address <span>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              {error && <p className="error-message">{error}</p>}
            </form>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Lostpassword;
