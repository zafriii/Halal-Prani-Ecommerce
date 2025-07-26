import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import '../styles/Dropdownfilter.css';

const SortDropdown = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const currentSort = searchParams.get('orderby');

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelect = (orderby, order) => {
    setOpen(false);

    const params = new URLSearchParams(searchParams);
    if (orderby) {
      params.set('orderby', orderby);
      params.set('order', order);
    } else {
      params.delete('orderby');
      params.delete('order');
    }

    navigate(`${location.pathname}?${params.toString()}`);
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
        <span>{currentSort ? `Sort: ${currentSort}` : 'DEFAULT SORT'}</span>
        {open ? <IoIosArrowUp className="dropdown-icon" size={20} /> : <IoIosArrowDown  className="dropdown-icon" size={20} />}    
      </div>

      {open && (
        <div className="dropdown-options">
          <div className="dropdown-option" onClick={() => handleSelect('', '')}>
            Default Sort
          </div>
          <div className="dropdown-option" onClick={() => handleSelect('date', 'desc')}>
            Sort by Newness
          </div>
          <div className="dropdown-option" onClick={() => handleSelect('price', 'asc')}>
            Sort by Price: Low to High
          </div>
          <div className="dropdown-option" onClick={() => handleSelect('price', 'desc')}>
            Sort by Price: High to Low
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
