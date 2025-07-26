import React, { useState, useEffect } from 'react';
import DashHeader from './DashHeader';
import Dashsidelink from './Dashsidelink';
import Footer from '../Footer';
import { useAuth } from '../../store/Auth'; 

function BillingAddress() {
  const { user } = useAuth(); 

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    country: 'Bangladesh',
    postcode: '',
  });

  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    const fetchBillingAddress = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/billingaddress', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });

        const billingData = res.ok ? await res.json() : {};

      
        setFormData(prev => ({
          ...prev,
          ...billingData,
          name: billingData.name || user?.username || '',
          email: billingData.email || user?.email || '',
          phone: billingData.phone || user?.phone || '',
        }));
      } catch (error) {
        console.error("Failed to load billing address:", error);

        setFormData(prev => ({
          ...prev,
          name: user?.username || '',
          email: user?.email || '',
          phone: user?.phone || '',
        }));
      }
    };

    fetchBillingAddress();
  }, [user]); 

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/billingaddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        // alert('Address saved successfully');
      } else {
        alert(result.message || 'Failed to save address');
      }

    } catch (err) {
      console.error('Save error:', err);
      alert('Something went wrong');
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
          <div className="account-address-section">
            <h2>Billing Address</h2>
            <form className="edit-address-section" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="yourName">Your Name <span>*</span></label>
                  <input type="text" id="yourName" name="name" value={formData.name} onChange={handleChange} required placeholder='name'/>
                </div>
                <div className="form-group">
                  <label htmlFor="yourPhone">Your Phone <span>*</span></label>
                  <input type="tel" id="yourPhone" name="phone" value={formData.phone} onChange={handleChange} required placeholder='phone no'/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="yourEmail">Your Email <span>*</span></label>
                <input type="email" id="yourEmail" name="email" value={formData.email} onChange={handleChange} required placeholder='email'/>
              </div>
              <div className="form-group">
                <label htmlFor="streetAddress">Street address <span>*</span></label>
                <input type="text" id="streetAddress" name="address" value={formData.address} onChange={handleChange} required placeholder='street address'/>
              </div>
              <div className="form-group">
                <label htmlFor="countryRegion">Country / Region <span>*</span></label>
                <select id="countryRegion" name="country" value={formData.country} onChange={handleChange}>
                  <option value="Bangladesh">Bangladesh</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="postcodeZip">Postcode / ZIP <span>*</span></label>
                <input type="text" id="postcodeZip" name="postcode" value={formData.postcode} onChange={handleChange} placeholder='post code'/>
              </div>
              <button type="submit" className="save-address-button" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'SAVE ADDRESS'}
              </button>
            </form>
          </div>                                
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BillingAddress;
