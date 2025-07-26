import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/AccountDetails.css';
import Dashsidelink from './Dashsidelink';
import DashHeader from './DashHeader';
import { useAuth } from '../../store/Auth';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Footer from '../Footer'

const AccountDetails = () => {
  const { user, storeTokenInLs, updateUser } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
   
    document.title = 'Edit Account - Halal Prani'

    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const validateField = (name, value) => {
    let error = '';

    if (name === 'username' && value.trim().length < 3) {
      error = 'Username must be at least 3 characters';
    }

    if (name === 'newPassword' && value.length > 0 && value.length < 6) {
      error = 'Password must be at least 6 characters';
    }

    if (name === 'confirmNewPassword' && value !== newPassword) {
      error = 'Passwords do not match';
    }

    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    validateField('username', username);
    validateField('newPassword', newPassword);
    validateField('confirmNewPassword', confirmNewPassword);

    const hasErrors = Object.values(validationErrors).some(error => error);
    if (hasErrors) return;

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/edit-account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          email,
          username,
          password: newPassword,
          confirmPassword: confirmNewPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Username taken") {
          alert("Username is already taken. Please choose a different one.");
        } else {
          alert(data.message || "Failed to update profile.");
        }
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        storeTokenInLs(data.token);
      }

      if (data.user && updateUser) {
        updateUser(data.user);

        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }

    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <>
    <div className="dashboard-page">
      <DashHeader />
      <div className="dashboard-content-area">
        <Dashsidelink />

        <div className="account-details-section">
          <form onSubmit={handleSaveChanges}>
            <div className="form-group">
              <label htmlFor="username">
                Username <span>*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateField('username', e.target.value);
                }}
                className={validationErrors.username ? 'validation-error' : ''}
                required
              />
              {validationErrors.username && (
                <div className="validation-error-message">{validationErrors.username}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email address <span>*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="password-change-section">
              <h3>Password change</h3>

              <div className="form-group password-group">
                <label htmlFor="currentPassword">
                  Current password (leave blank to leave unchanged)
                </label>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              <div className="form-group password-group">
                <label htmlFor="newPassword">
                  New password (leave blank to leave unchanged)
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    validateField('newPassword', e.target.value);
                    validateField('confirmNewPassword', confirmNewPassword); 
                  }}
                  className={validationErrors.newPassword ? 'validation-error' : ''}
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {validationErrors.newPassword && (
                  <div className="validation-error-message">{validationErrors.newPassword}</div>
                )}
              </div>

              <div className="form-group password-group">
                <label htmlFor="confirmNewPassword">Confirm new password</label>
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    validateField('confirmNewPassword', e.target.value);
                  }}
                  className={validationErrors.confirmNewPassword ? 'validation-error' : ''}
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                >
                  {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {validationErrors.confirmNewPassword && (
                  <div className="validation-error-message">{validationErrors.confirmNewPassword}</div>
                )}
              </div>
            </div>

            <button type="submit" className="save-changes-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "SAVE CHANGES"}
            </button>
          </form>
        </div>
      </div>
    </div>

    <Footer/>

    </>
  );
};

export default AccountDetails;
