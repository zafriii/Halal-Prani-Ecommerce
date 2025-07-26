import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import '../styles/WhyHalal.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const WhyHalal = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  const images = [
    '/images/halal1.png',
    '/images/halal2.png',
    '/images/halal3.png',
    '/images/halal4.png',
    '/images/halal5.png',
    '/images/halal6.png',
    '/images/halal7.png',
    '/images/halal8.png'
  ];

  const nextSlide = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {

    AOS.init({ duration: 1000 });

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval); 
  }, []); 

  return (
    <div className="why-halal-container" data-aos='fade-up'>
      <div className="why-halal-content">
        <div className="text-section">
          <h2>Why Halal Prani?</h2>
        </div>

        <div className="slider-section" data-aos='fade-up'>
          <div className={`slider-wrapper ${direction}`}>
            <img
              src={images[currentIndex]}
              key={currentIndex}
              alt={`Halal Prani ${currentIndex + 1}`}
              className={`slider-image ${direction}`}
            />
            <button className="slider-arrow left" onClick={prevSlide}>
            <span className="icon-swap-horizontal">
              <FaArrowLeftLong  className="default" />
              <FaArrowLeftLong  className="hover" />
            </span>
          </button>

          <button className="slider-arrow right" onClick={nextSlide}>
            <span className="icon-swap-horizontal">
             <FaArrowRightLong className="default" />
            <FaArrowRightLong  className="hover" />
            </span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyHalal;












