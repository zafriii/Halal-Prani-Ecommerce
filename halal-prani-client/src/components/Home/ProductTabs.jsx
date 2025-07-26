import { useEffect, useState } from "react";
import "../styles/ProductSection.css";
import BestSeller from "./BestSeller";
import Recent from "./Recent";
import Featured from "./Featured";
import { IoCartOutline } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loading from "../Loading";


const ProductTabs = () => {
  const [active, setActive] = useState("Best Seller");
  const [loading, setLoading] = useState(false);


  const handleTabChange = (tabName) => {
    if (tabName === active) return;
    setLoading(true);
    setTimeout(() => {
      setActive(tabName);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
  AOS.init({ duration: 1000 });
  }, []); 

  return (
    <div className="tabs-container">
      <div className="tab-texts" data-aos='fade-up'>
        <h3 className="tab-text1">Our Freshness</h3>
        <h2 className="tab-text2">Eid Special</h2>
        <h3 className="tab-text3">Unmatched Variety of Meats</h3>
      </div>

      <div className="tabs">
        {[
          { name: "Best Seller", icon: <IoCartOutline /> },
          { name: "Recent", icon: <IoCartOutline /> },
          { name: "Featured", icon: <FaRegStar /> },
        ].map((tab) => (
          <button
            key={tab.name}
            className={`tab-btn ${active === tab.name ? "active" : ""}`}
            onClick={() => handleTabChange(tab.name)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {loading ? (
         <Loading/>
        ) : (
          <>
            {active === "Best Seller" && <BestSeller />}
            {active === "Recent" && <Recent />}
            {active === "Featured" && <Featured />}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
