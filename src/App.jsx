import React from 'react'
import Productlist from './pages/Productlist'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './components/Home'
import ProductDetail from './pages/ProductDetail'

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/products" element={<Productlist/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
