import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './Pages/Home'
import MoreInfo from './components/Home/MoreInfo';
import Login_Signup from './components/Login-Signup/Login_Signup';
import ContactUs from './components/Contact/ContactUs';
import About from './components/About/About';
import Shop from './Pages/Shop';
import SingleProduct from './Pages/SingleProduct';
import MyAccountRedirect from './components/My account/MyAccountRedirect';
import AccountDetails from './components/My account/AccountDetails';
import Lostpassword from './components/My account/Lostpassword';
import ResetPassword from './components/My account/ResetPassword';
import Wishlist from './Pages/Wishlist';
import Cartpage from './components/Cartpage/Cartpage';
import ProductReviewPage from './components/Reviews/ProductReviewPage';
import CreateReviewPage from './components/Reviews/CreateReviewPage';
import Addresses from './components/My account/Addresses';
import BillingAddress from './components/My account/BillingAddress';
import ShippingAddress from './components/My account/ShippingAddress';
import Cart from './Pages/Cart';
import CheckoutPage from './Pages/Checkout';
import ComparisonPage from './components/Comparison/ComparisonPage';
import Member from './components/Member/Member';
import Order from './components/Order/Order';
import UserOrdersPage from './components/Order/UserOrdersPage';
import ViewOrder from './components/Order/ViewOrder';
import DownloadPage from './components/Downloads/Download';


function App() {


  return (
    <>
      
  <BrowserRouter>

   <Navbar/>

    <Routes> 

       <Route path='/' element={<Home />} />

        <Route path='/services' element={<MoreInfo />} />

        {/* <Route path='/my-account' element={<Login_Signup/>} /> */}

        <Route path='/my-account' element={<MyAccountRedirect/>} />

        <Route path='/my-account/edit-account' element={<AccountDetails/>} />

        <Route path='/my-account/edit-address' element={<Addresses/>} />

        <Route path='/my-account/edit-address/billing' element={<BillingAddress/>} />

        <Route path='/my-account/edit-address/shipping' element={<ShippingAddress/>} />

        <Route path="/lost-password" element={<Lostpassword />} />

        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        <Route path='/contact-us' element={<ContactUs/>} />

        <Route path='/about-us' element={<About/>} />

        <Route path='/shop' element={<Shop/>} />

        <Route path="/product-category/:categoryName" element={<Shop />} />

        <Route path="/product-category/:categoryName/:typeName" element={<Shop />} />

        <Route path="/search/:productName" element={<Shop/>} />

        {/* <Route path="/product/:productName" element={<ProductDetail/>} /> */}

         <Route path="/product/:productName" element={<SingleProduct/>} />

        <Route path="/wishlist" element={<Wishlist/>} />

        {/* <Route path="/cart" element={<Cartpage/>} /> */}

        <Route path="/cart" element={<Cart/>} />

        <Route path="/checkout" element={<CheckoutPage/>} />

        <Route path="/review/:productId" element={<ProductReviewPage />} />

        {/* <Route path="/review/:productSlug" element={<ProductReviewPage />} /> */}

        <Route path="/compare" element={<ComparisonPage/>} />

        <Route path="/member" element={<Member/>} />

        <Route path="/order-received/:orderNumber" element={<Order/>} />

        <Route path="/my-account/orders" element={<UserOrdersPage/>} />

        <Route path="/view-order/:orderNumber" element={<ViewOrder/>} />

        <Route path="/my-account/downloads" element={<DownloadPage/>} />


    </Routes>                

  </BrowserRouter>
      

    </>
  )
}

export default App
