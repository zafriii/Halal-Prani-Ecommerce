import React, { useState, useEffect } from 'react';
import DashHeader from './DashHeader';
import Dashsidelink from './Dashsidelink';
import Footer from '../Footer';

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

function ShippingAddress() {
  const [formData, setFormData] = useState({
    name: '',
    country: 'Bangladesh',
    street: '',
    apartment: '',
    district: '',
    postcode: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/shippingaddress', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFormData(data); 
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchShippingAddress();
  }, []);

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
      const res = await fetch('http://localhost:5000/api/shippingaddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        // alert("Shipping address saved");
      } else {
        alert(result.message || "Save failed");
      }
    } catch (error) {
      console.error('Save error:', error);
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
            <h2>Shipping Address</h2>

            <form className="edit-address-shipping-section" onSubmit={handleSubmit}>         
                          
                <div className="form-group">
                  <label htmlFor="yourName">Your Name <span>*</span></label>
                  <input type="text" id="yourName" name="name" value={formData.name} onChange={handleChange} required placeholder='name'/>
                </div>
              
              <div className="form-group">
                <label htmlFor="countryRegion">Country / Region <span>*</span></label>
                <select id="countryRegion" name="country" value={formData.country} onChange={handleChange}>
                  <option value="Bangladesh">Bangladesh</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="streetAddress">Street address <span>*</span></label>
                <input type="text" id="streetAddress" name="street" value={formData.street} onChange={handleChange} required placeholder='street address'/>
              </div>

              <div className="form-group">
                <label htmlFor="apartment">Apartment <span>*</span></label>
                <input type="text" id="apartment" name="apartment" value={formData.apartment} onChange={handleChange}  placeholder="apartment, suit, unit" />
              </div>

              <div className="form-group">
                <label htmlFor="district">District <span>*</span></label>
                <select id="district" name="district" value={formData.district} onChange={handleChange} required>
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="postcodeZip">Postcode / ZIP <span>*</span></label>
                <input type="text" id="postcodeZip" name="postcode" value={formData.postcode} onChange={handleChange} placeholder='zip code'/>
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

export default ShippingAddress;





