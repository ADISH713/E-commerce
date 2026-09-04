import React from 'react'
import Productlist from './pages/Productlist'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './components/Home'

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Home/>
    <Routes>
      <Route path="/" element={<Productlist/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
