import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "../styles/ProductSection.css";

const BestSeller = () => {
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/tag/Best Seller");
        const data = await response.json();
        setBestSellerProducts(data);
      } catch (error) {
        console.error("Error fetching best seller products:", error);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className="product-grid">
      {bestSellerProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default BestSeller;
