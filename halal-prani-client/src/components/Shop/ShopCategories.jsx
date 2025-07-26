import '../styles/ShopCategories.css'; 
import { IoIosArrowForward } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";

const ShopCategories = () => {


  const categories = [
    {
      id: 1,
      name: 'UNCATEGORIZED',
      imageUrl: 'https://halalprani.com/wp-content/uploads/2024/05/r14-600x600.jpg',
      link: '/product-category/uncategorized' 
    },
    {
      id: 2,
      name: 'BEEF',
      imageUrl: 'https://halalprani.com/wp-content/uploads/2024/05/HalalPrani_Shop_meat.webp',
      link: '/product-category/beef' 
    },
    {
      id: 3,
      name: 'CHICKEN & POULTRY',
      imageUrl: 'https://halalprani.com/wp-content/uploads/2024/05/HalalPrani_Shop_chicken-poultry.webp',
      link: '/product-category/chicken' 
    },
    {
      id: 4,
      name: 'COW',
      imageUrl: 'https://halalprani.com/wp-content/uploads/2024/05/cat_img.jpg',
      link: '/product-category/cow' 
    }
  ];

  return (
    <div className="shop-categories-section">
      <div className="shop-header-banner" >
        <div className="shop-header-content">
          <div className="breadcrumbs">
            <NavLink to="/" className="breadcrumb-link">Home</NavLink>
            <span className="breadcrumb-separator"><IoIosArrowForward /></span>
            <NavLink to="/shop" className="breadcrumb-current">Shop</NavLink>
          </div>
          <h1 className="shop-title">Shop</h1>
        </div>
      </div>

      <div className="categories-grid-container" >
        <div className="categories-grid">
          {categories.map(category => (
            <Link to={category.link} key={category.id} className="category-card-link">
              <div className="category-card">
                <div className="category-image-wrapper">
                  <img src={category.imageUrl} alt={category.name} className="category-image" />
                </div>
                <div className="category-name">
                  {category.name}
                </div>
              </div>
           </Link>
          ))}
        </div>
      </div>
    </div>    
  );
};

export default ShopCategories;