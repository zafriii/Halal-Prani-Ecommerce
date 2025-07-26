import React, { useState, useEffect } from 'react';
import '../styles/LoginModal.css';
import { useAuth } from '../../store/Auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginModal = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { storeTokenInLs } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedUser');
    const rememberFlag = localStorage.getItem('rememberMe') === 'true';

    if (rememberFlag && rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        remember: true,
      }));
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        storeTokenInLs(result.token);

        if (formData.remember) {
          localStorage.setItem('rememberedUser', formData.email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedUser');
          localStorage.removeItem('rememberMe');
        }

        const guestId = localStorage.getItem("guestId");
        console.log("Guest ID before merge:", guestId);

        if (guestId) {
          const mergeRes = await fetch("http://localhost:5000/api/cart/merge", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.token}`,
            },
            body: JSON.stringify({ guestId }),
          });

          const mergeData = await mergeRes.json();
          console.log("Merge response:", mergeData);

          if (mergeRes.ok) {
            localStorage.removeItem("guestId");
          }
        }

        handleClose();
        navigate('/my-account');
      } else {
        setErrorMsg(result.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className={`login-modal ${isClosing ? 'closing' : ''}`}>
        <div className="login-modal-header">
          <button className="close-modal" onClick={handleClose}>
            &times;
          </button>
        </div>

        <div className="login-modal-body">
          <div className="login-header-row">
            <h3 className="login-title">LOGIN</h3>
            <span
            className="create-account-link"
            onClick={() => {
              handleClose(); 
              setTimeout(() => {
                navigate('/my-account'); 
              }, 400); 
            }}
          >
            Create an account
          </span>

          </div>

          <div className="login-form">
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

              <div className="form-group password-input">
                <label>
                  Password <span>*</span>
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="toggle-password" onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="error-message" style={{ color: '#a00', fontSize: '14px', marginBottom: '10px' }}>
                  {errorMsg}
                </div>
              )}

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </button>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <NavLink to="/lost-password" className="forgot-password">
                  LOST YOUR PASSWORD?
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
