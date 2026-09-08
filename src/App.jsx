import React from 'react'
import Productlist from './pages/Productlist'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
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

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      getCartByUserId(user.id).then((existingCart) => {
        if (existingCart) {
          dispatch(setCart(existingCart));
        }
      });
    }
  }, [user, dispatch]);
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/products" element={<Productlist/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
