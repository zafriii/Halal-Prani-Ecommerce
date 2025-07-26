import React, { useEffect, useState } from 'react';
import '../styles/MoreInfo.css';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Footer from '../Footer';


const reviews = [
  {
    text: "Totally impressed with my first order from Halal Prani! The website was easy to navigate, and my meat arrived fresh and well-packaged. The steaks were amazing—just like they described, and the cooking instructions were super helpful. Can't wait to try more cuts next time!.",
    name: "Naeem Hassan",
    title: "Client",
  },
  {
    text: "Thrilled with my experience ordering from Halal Prani! The online platform was user-friendly, and my order arrived promptly and perfectly chilled. The quality of the meat exceeded my expectations—it was fresh and impeccably halal-certified. Plus, the cooking instructions provided made preparing dinner a breeze. Looking forward to my next order!",
    name: "Karim Ahmed",
    title: "Customer",
  },

];

function MoreInfo() {
  const [currentReview, setCurrentReview] = useState(0);

  const goToNext = () => {
    setCurrentReview((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const goToPrev = () => {
    setCurrentReview((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  useEffect (() => {
    document.title = "Services - Halal Prani"
  }, [])

  return (
    <>
    <div className="more-info-page">
      <section className="info-section butchery-service">
        <div className="info-content">
          <h2 className="section-title">Butchery Service <span className="arrow"><FaArrowRight size={18} /></span></h2>
          <p className="section-description">
            Experience the art of butchery like never before at Halal Prani. Our skilled artisans meticulously
            prepare each cut to perfection, ensuring the utmost quality and freshness.
          </p>
        </div>
        <div className="info-image">
          <img src='/images/butchery-service.png' alt="Our Butchery Service" />
        </div>
      </section>

      <section className="info-section customer-reviews">
        <div className="info-content text-right-aligned">
          <h2 className="section-title">Our Customer Reviews <span className="arrow"><FaArrowRight size={18} /></span></h2>
          <div className="slider-container">
            <div className="review-slider" style={{ transform: `translateX(-${currentReview * 100}%)` }}>
              {reviews.map((review, index) => (
                <div key={index} className="customer-review-card">
                  <p className="review-text">{review.text}</p>
                  <div className="more-info-review">
                    <p className="reviewer-name">{review.name}</p>
                    <p className="reviewer-title">{review.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="slider-nav prev-btn" onClick={goToPrev}>
              <FaArrowLeft size={20} />
            </button>
            <button className="slider-nav next-btn" onClick={goToNext}>
              <FaArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="info-image">
        <img src='/images/contact.png' alt="Our Customer Reviews" />
        </div>
      </section>

      <section className="info-section cooking-service">
        <div className="info-content">
          <h2 className="section-title">Cooking Service <span className="arrow"><FaArrowRight size={18} /></span></h2>
          <p className="section-description">
            Elevate your culinary creations with our exclusive cooking service at. Whether you’re hosting a
            dinner party or seeking weekday meal solutions, trust us to bring out the best flavors in every
            dish, leaving you with unforgettable dining experiences.
          </p>
        </div>
        <div className="info-image">
          <img src='/images/cooking-service.png' alt="Our Cooking Service" />
        </div>
      </section>
    </div>

    <Footer/>

    </>         

  );
}

export default MoreInfo;