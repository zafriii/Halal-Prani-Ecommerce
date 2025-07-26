import React, { useEffect } from 'react'
import HeroBanner from '../components/Home/HeroBanner'
import Servicesection from '../components/Home/Servicesection'
import Services from '../components/Home/Services'
import WhyHalal from '../components/Home/WhyHalal'
import Recipes from '../components/Home/Recipes '
import Tipssection from '../components/Home/Tipssection'
import Footer from '../components/Footer'
import ProductTabs from '../components/Home/ProductTabs'
import RelatedProducts from '../components/Home/RelatedProducts'

function Home() {


useEffect(() => {
    document.title = 'Halal Prani'
  },[])

  return (
    <>
     
     <HeroBanner/>
     <Servicesection/>
     <Services/>
     <ProductTabs/>
     <RelatedProducts/>
     <WhyHalal/>
     <Recipes/>
     <Tipssection/>
     <Footer/>
    </>
  )
}

export default Home