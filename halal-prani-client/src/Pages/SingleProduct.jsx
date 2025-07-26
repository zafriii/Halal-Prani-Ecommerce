import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailsPage from '../components/Product Details/ProductDetail';
import RelatedProducts from '../components/Product Details/RelatedProduct';
import Footer from '../components/Footer';
import CreateReviewPage from '../components/Reviews/CreateReviewPage';
import Loading from '../components/Loading';

const slugify = (text) =>
  text?.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

const SingleProduct = () => {
  const { productName } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products`);
        const data = await res.json();
        const found = data.find((p) => slugify(p.name) === productName);
        setProduct(found || null);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [productName]);

  if (!product) return <Loading/>;

  return (
    <>
      <ProductDetailsPage product={product} />
      <RelatedProducts currentProduct={product} />
      <Footer />
    </>
  );
};

export default SingleProduct;
