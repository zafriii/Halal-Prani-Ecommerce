import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/LostReset.css';
import DashHeader from './DashHeader';
import Footer from '../Footer';

const ResetPassword = () => {
  const { resetToken } = useParams(); 
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/reset-password/${resetToken}`, {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Password reset successful.');
        setFormData({ password: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Invalid or expired token.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <>
    <DashHeader/>
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            New Password <span>*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label>
            Confirm Password <span>*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <button type="submit">Reset Password</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>

    <Footer/>

    </>
  );
};

export default ResetPassword;
