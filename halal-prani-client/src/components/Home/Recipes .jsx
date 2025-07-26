import React, { useEffect } from 'react';
import '../styles/Recipes.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Recipes = () => {


useEffect(() => {
AOS.init({ duration: 1000 });
}, []); 

  return (
    <div className="recipes-container" data-aos='fade-up'>
      <h2 className="recipes-heading">Our Recipes</h2>
     
      <div className="videos-container">
        <div className="video-wrapper" data-aos='fade-up'>
          <iframe 
            src="https://www.youtube.com/embed/PHmE8SAxlMg?si=1CCaz1tK95N4Ktqw" 
            title="YouTube video player 1" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
        
        <div className="video-wrapper" data-aos='fade-up'>
          <iframe 
            src="https://www.youtube.com/embed/rSktrPFc3ug?si=ClplL_EGtJImLxdQ" 
            title="YouTube video player 2" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
        
        <div className="video-wrapper" data-aos='fade-up'>
          <iframe 
            src="https://www.youtube.com/embed/dVFqBnQqzwE?si=rtmDg_ZT8mgCeKLZ" 
            title="YouTube video player 3" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default Recipes;