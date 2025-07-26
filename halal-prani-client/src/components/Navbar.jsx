import React, { useEffect, useState } from 'react';
import './styles/Navbar.css';
import { TfiHeadphoneAlt } from "react-icons/tfi";
import {
  FaFacebookF, FaTwitter, FaYoutube, FaHeart, FaCog, FaClipboardList,
  FaDownload, FaMapMarkerAlt, FaUserEdit, FaSignOutAlt
} from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { MdCompareArrows } from "react-icons/md";
import { TbMeat } from "react-icons/tb";
import { NavLink, useNavigate } from 'react-router-dom';
import LoginModal from './Login-Signup/LoginModal';
import { useAuth } from '../store/Auth';
import CartModal from './Cartpage/CartModal';

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const {
    isLoggedin,
    LogoutUser,
    cartCount,
    wishCount,
    updateCartCount,
    updateWishCount,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    setShowAccountDropdown(false);
    LogoutUser();
    navigate('/my-account');
  };

  useEffect(() => {
    updateCartCount();
    updateWishCount();
  }, []);

  return (
    <div className="navbar-container">
      {/* Upper Navbar */}
      <div className="upper-nav">
        <div className="upper-nav-content">
          <div className="left-section">
            <TfiHeadphoneAlt className="nav-icon" />
            <span className="phone-number">2222285949</span>
            <span className="call-us">Call Us</span>
          </div>

          <div className="right-section">
            <div
              className="login"
              onMouseEnter={() => isLoggedin && setShowAccountDropdown(true)}
              onMouseLeave={() => isLoggedin && setShowAccountDropdown(false)}
            >
              {isLoggedin ? (
                <NavLink to="/my-account" className="nav-button-link">
                  <span className="icon-swap nav-icon">
                    <FaRegUser className="default" size={13} />
                    <FaRegUser className="hover" size={13} />
                  </span>
                  MY ACCOUNT
                </NavLink>
              ) : (
                <button onClick={() => setShowLoginModal(true)}>
                  <span className="icon-swap nav-icon">
                    <FaRegUser className="default" size={13} />
                    <FaRegUser className="hover" size={13} />
                  </span>
                  LOGIN
                </button>
              )}

              {isLoggedin && showAccountDropdown && (
                <div className="account-dropdown">
                  <ul>
                    <li>
                      <NavLink to="/my-account">
                        <FaCog size={14} /> Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-account/orders">
                        <FaClipboardList size={14} /> Orders
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-account/downloads">
                        <FaDownload size={14} /> Downloads
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-account/edit-address">
                        <FaMapMarkerAlt size={14} /> Addresses
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-account/edit-account">
                        <FaUserEdit size={14} /> Account details
                      </NavLink>
                    </li>
                    <li>
                      <button onClick={handleLogout}>
                        <FaSignOutAlt size={14} /> Log out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <NavLink to="/shop" className="compare">
              <span className="icon-swap nav-icon">
                <TbMeat className="default" size={18} />
                <TbMeat className="hover" size={18} />
              </span>
             SHOP
            </NavLink>

            <NavLink to="/compare" className="compare">
              <span className="icon-swap nav-icon">
                <MdCompareArrows className="default" size={20} />
                <MdCompareArrows className="hover" size={20} />
              </span>
              COMPARE
            </NavLink>

            {/* Social Icons */}
            <div className="social-icons">
              <span className="icon-swap social-icon">
                <FaFacebookF className="default" />
                <FaFacebookF className="hover" />
              </span>
              <span className="icon-swap social-icon">
                <FaTwitter className="default" />
                <FaTwitter className="hover" />
              </span>
              <span className="icon-swap social-icon">
                <FaYoutube className="default" />
                <FaYoutube className="hover" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
      <div className="lower-nav">
        <div className="lower-nav-content">
          <a href="/">
            <img src="/images/halal-prani-logo.png" alt="Logo" className="logo" />
          </a>

          <div className="icon-section">
            {/* Wishlist */}
            <div className="icon-badge-wrapper">
              <NavLink to="/wishlist">
                <span className="icon-swap nav-icon">
                  <FaRegHeart className="default" size={22} />
                  <FaRegHeart className="hover" size={22} />
                </span>
              </NavLink>
              <span className="wish-count">{isLoggedin ? wishCount : 0}</span>
            </div>

            {/* Cart */}
            <div className="icon-badge-wrapper">
              <button onClick={() => setShowCartModal(true)}>
                <span className="icon-swap nav-icon">
                  <BsCart3 className="default" size={22} />
                  <BsCart3 className="hover" size={22} />
                </span>
              </button>
              <span className="item-count">{cartCount}</span>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showCartModal && <CartModal onClose={() => setShowCartModal(false)} />}
    </div>
  );
};

export default Navbar;
