import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductSearch.css';

function ProductSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isExpanded]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim() === '') {
      setSuggestions([]);
      return;
    }

    clearTimeout(inputRef.current?.debounceTimer);
    inputRef.current.debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        const filtered = data.filter((p) =>
          p.name.toLowerCase().includes(val.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 6));
      } catch (err) {
        console.error('Suggestion error:', err);
      }
    }, 400);
  };

  const handleSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/search/${encodeURIComponent(query.trim())}`);
        setSuggestions([]);
      }
    }
  };

  const handleClickSuggestion = (name) => {
    setQuery(name);
    setSuggestions([]);
    navigate(`/search/${encodeURIComponent(name)}`);
  };

  return (
    <div className={`smart-search-wrapper ${isExpanded ? 'expanded' : ''}`}>
      {!isExpanded ? (
        <button className="collapsed-search-btn" onClick={() => setIsExpanded(true)}>
        <IoSearchOutline size={18} />  <span className="search-placeholder">Search</span>  
        </button>
      ) : (
        <div className="search-input-wrapper">
          <IoSearchOutline className="icon" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Press Enter to search"
            onChange={handleSearchChange}
            onKeyDown={handleSubmit}
            onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
          />
          
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((item) => (
                <li key={item.id} onClick={() => handleClickSuggestion(item.name)}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSearch