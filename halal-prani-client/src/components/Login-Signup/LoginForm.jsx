import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/Login_Signup.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/Auth';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { storeTokenInLs } = useAuth();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        remember: true
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        storeTokenInLs(result.token);

        if (formData.remember) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
      

        const guestId = localStorage.getItem("guestId");

        console.log("guestId before merge:", guestId);

        if (guestId) {
          const mergeResponse = await fetch("http://localhost:5000/api/cart/merge", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.token}`,
            },
            body: JSON.stringify({ guestId }),
          });

          const mergeData = await mergeResponse.json();
          console.log("Merge response:", mergeData);

          if (mergeResponse.ok) {
            localStorage.removeItem("guestId");
          }
        }

        navigate('/my-account');
      } else {
        setErrorMsg(result.message || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group password-input">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password*"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <span className="toggle-password" onClick={() => setShowPassword(prev => !prev)}>
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
      </div>

      <div className="form-options">
        <label className="remember-me">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
          />
          REMEMBER ME
        </label>
      </div>

      {errorMsg && (
        <div className="error-message" style={{ color: '#a00', fontSize: '14px', marginBottom: '15px' }}>
          {errorMsg}
        </div>
      )}

      <button type="submit" className="form-button" disabled={isLoading}>
        {isLoading ? 'LOGGING IN...' : 'LOGIN'}
      </button>

      <NavLink to="/lost-password" className="forgot-password">
        LOST YOUR PASSWORD?
      </NavLink>
    </form>
  );
}

export default LoginForm;
