import React from 'react'
import Productlist from './pages/Productlist'
import {BrowserRouter,Routes,Route,useLocation} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './components/Home'
import ProductDetail from './pages/ProductDetail'
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCartByUserId } from './services/cartServices';
import { setCart } from './redux/slices/cartSlice';
import Cart from './pages/Cart'
import ProtectedRoute from './routes/ProtectedRoute'
import Wishlist from './pages/Wishlist'
import { getWishlistByUserId } from './services/wishlistServices';
import { setWishlist } from './redux/slices/wishlistSlice';
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import About from './pages/About';
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state)=>state.cart);
  useEffect(() => {
  if (user) {
    console.log("Logged in user:", user);

    getCartByUserId(user.id).then((existingCart) => {
      if (existingCart) {
        dispatch(setCart(existingCart));
      }
    });

    getWishlistByUserId(user.id).then((existingWishlist) => {
      if (existingWishlist) {
        dispatch(setWishlist(existingWishlist));
      }
    });
  }
}, [user, dispatch]);
  console.log("USER:", user);
  console.log("CART:", cart);

  function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register'|| !['/','/products','/login','/register','/cart','/orders','/wishlist','/checkout','/about',].includes(location.pathname) &&
  !location.pathname.startsWith('/product/');

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Productlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNavbar && <Footer/>}
    </>
  );
}

  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <AppContent/>
    </BrowserRouter>
  )
}

export default App
