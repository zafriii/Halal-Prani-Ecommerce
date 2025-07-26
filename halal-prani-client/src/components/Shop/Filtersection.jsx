import React from 'react'
import ProductSearch from './ProductSearch'
import '../styles/Filtersection.css'
import CategoryDropdown from './CategoryDropdown'
import SortDropdown from './SortDropdown'

function Filtersection() {
  return (
    
    <>
    <div className="filter-section">
       <div className="filter-dropdown">
         <CategoryDropdown/>
         <SortDropdown/>
       </div>
      <div className="filter-search">
        <ProductSearch/>
      </div>
    </div>
    </>
  )
}

export default Filtersection