import React, { useEffect, useState } from 'react';
import '../styles/Checkout.css';

const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogura", "Brahmanbaria",
  "Chandpur", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur",
  "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur",
  "Jashore", "Jhalokathi", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj",
  "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj",
  "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj",
  "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira",
  "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
].sort();

function CheckoutAddresses({ onAddressChange }) {
  const [billing, setBilling] = useState({
    name: '', phone: '', email: '', address: '', country: 'Bangladesh', postcode: ''
  });

  const [shipping, setShipping] = useState({
    name: '', street: '', apartment: '', district: '', country: 'Bangladesh', postcode: ''
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [showShipping, setShowShipping] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');

        const [billingRes, shippingRes] = await Promise.all([
          fetch('http://localhost:5000/api/billingaddress', {
            headers: { Authorization: 'Bearer ' + token }
          }),
          fetch('http://localhost:5000/api/shippingaddress', {
            headers: { Authorization: 'Bearer ' + token }
          })
        ]);

        if (billingRes.ok) {
          const billingData = await billingRes.json();
          setBilling(billingData);
        }

        if (shippingRes.ok) {
          const shippingData = await shippingRes.json();
          setShipping(shippingData);
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange({ billing, shipping, orderNotes });
    }
  }, [billing, shipping, orderNotes]);

  const handleChange = (section, e) => {
    const { name, value } = e.target;
    if (section === 'billing') {
      setBilling(prev => ({ ...prev, [name]: value }));
    } else {
      setShipping(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <div className="account-address-section">
        <h2>Billing Address</h2>
        <form className="Edit-address-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="billingName">Your Name <span>*</span></label>
              <input type="text" id="billingName" name="name" value={billing.name} onChange={(e) => handleChange('billing', e)} required placeholder="name" />
            </div>
            <div className="form-group">
              <label htmlFor="billingPhone">Your Phone <span>*</span></label>
              <input type="tel" id="billingPhone" name="phone" value={billing.phone} onChange={(e) => handleChange('billing', e)} required placeholder="phone no" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="billingEmail">Your Email <span>*</span></label>
            <input type="email" id="billingEmail" name="email" value={billing.email} onChange={(e) => handleChange('billing', e)} required placeholder="email" />
          </div>

          <div className="form-group">
            <label htmlFor="billingAddress">Street address <span>*</span></label>
            <input type="text" id="billingAddress" name="address" value={billing.address} onChange={(e) => handleChange('billing', e)} required placeholder="street address" />
          </div>

          <div className="form-group">
            <label htmlFor="billingCountry">Country / Region <span>*</span></label>
            <select id="billingCountry" name="country" value={billing.country} onChange={(e) => handleChange('billing', e)}>
              <option value="Bangladesh">Bangladesh</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="billingPostcode">Postcode / ZIP <span>*</span></label>
            <input type="text" id="billingPostcode" name="postcode" value={billing.postcode} onChange={(e) => handleChange('billing', e)} placeholder="post code" />
          </div>
        </form>
      </div>

      <div className="account-address-section">
        <h2>Shipping Address</h2>

        <div className="shipping-show">
          <label>
            <input
              type="checkbox"
              checked={showShipping}
              onChange={() => setShowShipping(!showShipping)}
              style={{ marginRight: '10px' }}
            />
            Ship to a different address?
          </label>
        </div>

        {showShipping && (
          <form className="Edit-address-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="shippingName">Your Name <span>*</span></label>
                <input type="text" id="shippingName" name="name" value={shipping.name} onChange={(e) => handleChange('shipping', e)} required placeholder="name" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shippingCountry">Country / Region <span>*</span></label>
              <select id="shippingCountry" name="country" value={shipping.country} onChange={(e) => handleChange('shipping', e)}>
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="shippingStreet">Street address <span>*</span></label>
              <input type="text" id="shippingStreet" name="street" value={shipping.street} onChange={(e) => handleChange('shipping', e)} required placeholder="street address" />
            </div>

            <div className="form-group">
              <label htmlFor="shippingApartment">Apartment <span>*</span></label>
              <input type="text" id="shippingApartment" name="apartment" value={shipping.apartment} onChange={(e) => handleChange('shipping', e)} placeholder="apartment, suit, unit" />
            </div>

            <div className="form-group">
              <label htmlFor="shippingDistrict">District <span>*</span></label>
              <select id="shippingDistrict" name="district" value={shipping.district} onChange={(e) => handleChange('shipping', e)} required>
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="shippingPostcode">Postcode / ZIP <span>*</span></label>
              <input type="text" id="shippingPostcode" name="postcode" value={shipping.postcode} onChange={(e) => handleChange('shipping', e)} placeholder="zip code" />
            </div>

            <div className="form-group">
              <label htmlFor="ordernotes">Order notes <span>*</span></label>
              <textarea
                id="ordernotes"
                name="ordernotes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Notes about your order, e.g., for special delivery"
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default CheckoutAddresses;
