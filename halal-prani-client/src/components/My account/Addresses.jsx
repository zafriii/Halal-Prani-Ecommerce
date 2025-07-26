import React, { useEffect, useState } from 'react';
import DashHeader from './DashHeader';
import Dashsidelink from './Dashsidelink';
import '../styles/Address.css';
import { NavLink } from 'react-router-dom';
import Footer from '../Footer';

function Addresses() {
  const [billingAddress, setBillingAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    document.title = 'Edit Address - Halal Prani'

    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');

        const [billingRes, shippingRes] = await Promise.all([
          fetch('http://localhost:5000/api/billingaddress', {
            headers: { 'Authorization': 'Bearer ' + token },
          }),
          fetch('http://localhost:5000/api/shippingaddress', {
            headers: { 'Authorization': 'Bearer ' + token },
          })
        ]);

        if (billingRes.ok) {
          const billingData = await billingRes.json();
          setBillingAddress(billingData);
        }

        if (shippingRes.ok) {
          const shippingData = await shippingRes.json();
          setShippingAddress(shippingData);
        }

      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <>
      <div className="dashboard-page">
        <DashHeader />
        <div className="dashboard-content-area">
          <Dashsidelink />

          <div className="account-address-section">
            <p className="address-intro-text">
              The following addresses will be used on the checkout page by default.
            </p>

            <div className="address-sections-container">
              <div className="address-sub-section billing-address">
                <h3 className="address-heading">Billing address</h3>

                {!loading && billingAddress ? (
                  <>
                    <p className="address-line"><strong>Name:</strong> {billingAddress.name}</p>
                    <p className="address-line"><strong>Phone:</strong> {billingAddress.phone}</p>
                    <p className="address-line"><strong>Email:</strong> {billingAddress.email}</p>
                    <p className="address-line"><strong>Country:</strong> {billingAddress.country}</p>
                    <p className="address-line"><strong>Street Address:</strong> {billingAddress.address}</p>
                    <p className="address-line"><strong>Postcode:</strong> {billingAddress.postcode}</p>

                    <NavLink to="/my-account/edit-address/billing" className="add-address-link">
                      Edit billing address
                    </NavLink>
                  </>
                ) : !loading ? (
                  <>
                    <p className="no-address-text">You have not set up this type of address yet.</p>
                    <NavLink to="/my-account/edit-address/billing" className="add-address-link">
                      Add billing address
                    </NavLink>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              <div className="address-sub-section shipping-address">
                <h3 className="address-heading">Shipping address</h3>

                {!loading && shippingAddress ? (
                  <>
                    <p className="address-line"><strong>Name:</strong> {shippingAddress.name}</p>
                    <p className="address-line"><strong>Country:</strong> {shippingAddress.country}</p>
                    <p className="address-line"><strong>Street:</strong> {shippingAddress.street}</p>
                    <p className="address-line"><strong>Apartment:</strong> {shippingAddress.apartment}</p>
                    <p className="address-line"><strong>District:</strong> {shippingAddress.district}</p>
                    <p className="address-line"><strong>Postcode:</strong> {shippingAddress.postcode}</p>

                    <NavLink to="/my-account/edit-address/shipping" className="add-address-link">
                      Edit shipping address
                    </NavLink>
                  </>
                ) : !loading ? (
                  <>
                    <p className="no-address-text">You have not set up this type of address yet.</p>
                    <NavLink to="/my-account/edit-address/shipping" className="add-address-link">
                      Add shipping address
                    </NavLink>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Addresses;
