import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/Auth';
import { IoIosArrowForward } from "react-icons/io";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Member.css';

const Member = () => {
  const { user, isLoggedin } = useAuth();
  const [memberData, setMemberData] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const navigate = useNavigate();

  const fetchMemberData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/member', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.member) {
        setMemberData(data.member);
      } else {
        setMemberData(null);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedin) {
      setShouldRedirect(true);
      return;
    }

    if (shouldRedirect) {
      window.location.href = '/login';
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user?.email || '',
          name: user?.username || '',
          phone: user?.phone || ''
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMemberData(data.member);
      } else {
        console.error(data.message || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (isLoggedin) {
      fetchMemberData();
    }
  }, [isLoggedin]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  return (
    <>

    <nav className="member-navbar">
        <div className="container">
          <a href="/" className="home-link">Home</a>
          <span className="account-icon"><IoIosArrowForward size={12} /></span>
          <span className="current-page">Membership</span>
        </div>
      </nav>

      <div className="member" data-aos="fade-up">
        {memberData ? (
          <div className="coupon-card">
            <h2> {user.username}, You're now a member at Halal Prani</h2>
            <p className='join'>Joined since {formatDate(memberData.createdAt)}</p>
            <p>Your Coupon Code:</p>
            <div className="coupon-code">{memberData.couponCode || 'DISCOUNT10'}</div>
            <p>Use this coupon on your next purchase to get a discount!</p>
          </div>
        ) : (
          <div className="member-section">
            <h2>Get your membership</h2>
            <p>Get 10% off on your purchase</p>

            <form onSubmit={handleSubmit}>
             <div className="form-group">
                <label htmlFor="memberEmail">Email <span>*</span></label>
                <input
                  type="email"
                  id="memberEmail"
                  name="email"
                  value={user?.email || ''}
                  readOnly
                  required
                  placeholder="Email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="memberName">Name <span>*</span></label>
                <input
                  type="text"
                  id="memberName"
                  name="name"
                  value={user?.username || ''}
                  readOnly
                  required
                  placeholder="Full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="memberPhone">Phone <span>*</span></label>
                <input
                  type="text"
                  id="memberPhone"
                  name="phone"
                  value={user?.phone || ''}
                  readOnly
                  required
                  placeholder="Phone number"
                />
              </div>

              <div className="member-btns">
                <button className="submit-member" type="submit">
                  Be a Member
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Member;
