import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/Auth';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/Login_Signup.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { storeTokenInLs } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';

    if (name === 'username' && value.trim().length < 3) {
      error = 'Username must be at least 3 characters';
    }

    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Enter a valid email';
    }

    if (name === 'phone' && !/^\d{10,15}$/.test(value)) {
      error = 'Phone number must be 10 to 15 digits';
    }

    if (name === 'password' && value.length < 6) {
      error = 'Password must be at least 6 characters';
    }

    if (name === 'confirmPassword' && value !== formData.password) {
      error = 'Passwords do not match';
    }

    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    validateField(name, value);
    if (name === 'password') {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const validateAll = () => {
    const tempErrors = {};
    if (formData.username.trim().length < 3)
      tempErrors.username = 'Username must be at least 3 characters';

    if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = 'Enter a valid email';

    if (!/^\d{10,15}$/.test(formData.phone))
      tempErrors.phone = 'Phone number must be 10 to 15 digits';

    if (formData.password.length < 6)
      tempErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = 'Passwords do not match';

    setValidationErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const res_data = await response.json();

      if (response.ok) {
        const token = res_data.token;
        storeTokenInLs(token);
        alert('Registration successful!');

        const guestId = localStorage.getItem("guestId");
        if (guestId) {
          const mergeResponse = await fetch("http://localhost:5000/api/cart/merge", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ guestId }),
          });

          const mergeData = await mergeResponse.json();
          console.log("Merge response after register:", mergeData);

          if (mergeResponse.ok) {
            localStorage.removeItem("guestId");
          }
        }

        setFormData({
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => navigate('/my-account'), 1000);
      } else {
        alert(res_data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="Username*"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        {validationErrors.username && <div className="validation-error-message">{validationErrors.username}</div>}
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {validationErrors.email && <div className="validation-error-message">{validationErrors.email}</div>}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="phone"
          placeholder="Phone*"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        {validationErrors.phone && <div className="validation-error-message">{validationErrors.phone}</div>}
      </div>

      <div className="form-group password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password*"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <span className="toggle-password" onClick={togglePasswordVisibility}>
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </span>
        {validationErrors.password && <div className="validation-error-message">{validationErrors.password}</div>}
      </div>

      <div className="form-group">
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password*"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        {validationErrors.confirmPassword && <div className="validation-error-message">{validationErrors.confirmPassword}</div>}
      </div>

      <button type="submit" className="form-button" disabled={isLoading}>
        {isLoading ? "REGISTERING..." : "REGISTER"}
      </button>
    </form>
  );
}

export default RegisterForm;
