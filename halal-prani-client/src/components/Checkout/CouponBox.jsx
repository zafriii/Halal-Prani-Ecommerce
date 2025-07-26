import React, { useState, useEffect } from 'react';
import '../styles/CouponBox.css';

const CouponBox = ({ isMember, appliedCoupon, setAppliedCoupon }) => {
  const [showInput, setShowInput] = useState(false);
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    if (!appliedCoupon) setCoupon('');
  }, [appliedCoupon]);

  const toggleInput = () => setShowInput(!showInput);

  const applyCoupon = () => {
    if (!isMember) {
      alert('You must be a member to use coupons.');
      return;
    }

    if (coupon.trim().toUpperCase() === 'DISCOUNT10') {
      setAppliedCoupon('DISCOUNT10');
      setShowInput(false);
    } else {
      alert('Invalid coupon code.');
    }
  };

  return (
    <div className="coupon-section">
      <div className="coupon-header" onClick={toggleInput}>
        <strong>Have a coupon?</strong>
        <span className="coupon-toggle-text">
          {showInput ? 'Click here to hide' : 'Click here to enter your code'}
        </span>
      </div>

      {showInput && (
        <div className="coupon-input-area">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter your coupon code"
            className="coupon-input"
          />
          <button className="coupon-btn" onClick={applyCoupon}>
            APPLY COUPON
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponBox;
