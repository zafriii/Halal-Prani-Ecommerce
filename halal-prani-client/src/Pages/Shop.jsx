import React, { useEffect } from 'react'
import ShopCategories from '../components/Shop/ShopCategories'
import ProductGridSection from '../components/Shop/ProductGridSection'
import Filtersection from '../components/Shop/Filtersection'
import Footer from '../components/Footer'

function Shop() {

  useEffect (() => {
    document.title = "Shop - Halal Prani"
  }, [])


  return (

   <>
    <ShopCategories/>
    <Filtersection/>
    <ProductGridSection/>
    <Footer/>  
   </>
  )
}

export default Shop