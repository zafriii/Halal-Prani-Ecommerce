import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import '../styles/Dropdownfilter.css';

const CategoryDropdown = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        const unique = Array.from(new Set(data.map(p =>
          p.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")
        )));
        setCategories(unique);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const toggleDropdown = () => setOpen(prev => !prev);

  const handleSelect = (value) => {
    setOpen(false);
    if (value === 'all') {
      navigate('/shop');
    } else {
      navigate(`/product-category/${value}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown-wrapper" ref={dropdownRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span>{categoryName ? categoryName.replace(/-/g, ' ').toUpperCase() : 'ALL CATEGORIES'}</span>
        {open ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
      </div>

      {open && (
        <div className="dropdown-options">
          <div className="dropdown-option" onClick={() => handleSelect('all')}>
            All Categories
          </div>
          {categories.map((cat, i) => (
            <div
              key={i}
              className="dropdown-option"
              onClick={() => handleSelect(cat)}
            >
              {cat.replace(/-/g, ' ').toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
