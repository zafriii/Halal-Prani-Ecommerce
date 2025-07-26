import { useEffect, useState } from "react";
import "../styles/ProductSection.css";
import ProductCard from "./ProductCard";

const Recent = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products/tag/Recent"
        );
        const data = await response.json();
        setRecentProducts(data);
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };

    fetchRecentProducts();
  }, []);

  return (
    <div className="product-grid">
      {recentProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Recent;
