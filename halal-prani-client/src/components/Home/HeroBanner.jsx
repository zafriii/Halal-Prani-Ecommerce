import { useState, useEffect } from 'react';
import '../styles/Hero.css';

function HeroBanner() {
  const slides = [
    {
      src: "/images/slide-1.png",
      headline: "Fresh & Halal Meat at Your Doorstep",
    },
    {
      src: "/images/slide-2.png",
      headline: "Premium Cow, Goat, Chicken & Beef",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const goToSlide = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 400);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="hero-slider">
      <div className={`slide ${fade ? 'fade-in' : 'fade-out'}`}>
        <div
          className="slide-image"
          style={{ backgroundImage: `url(${slides[currentIndex].src})` }}
        />
        <div className="slide-content">
          <h1>{slides[currentIndex].headline}</h1>
          <button>
            <a href='/shop'>Learn More</a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
