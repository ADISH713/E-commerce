import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../components/Home';
import Productlist from '../pages/Productlist';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import AdminProtectedRoute from './AdminProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../admin/AdminLayout';
import AdminProducts from '../admin/pages/AdminProducts';
import AddProduct from '../admin/pages/AddProduct';
import EditProduct from '../admin/pages/EditProduct';
import AdminUsers from '../admin/pages/AdminUsers';
import AdminOrders from '../admin/pages/AdminOrders';
import AdminDashboard from '../admin/pages/AdminDashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
            <AdminProtectedRoute>
                <AdminLayout />
            </AdminProtectedRoute>
        }
    >
        <Route index element={<AdminDashboard />} />

        <Route
            path="products"
            element={<AdminProducts />}
        />

        <Route path="products/add" element={<AddProduct />} />

        <Route
          path="products/edit/:id"
          element={<EditProduct />}
      />
              
        <Route path="users" element={<AdminUsers />} />

      
      <Route path="orders" element={<AdminOrders />} />
      </Route>

        <Route
        path="/"
        element={<Home />}
      />
      
      <Route
        path="/products"
        element={<Productlist />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetail />}
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;