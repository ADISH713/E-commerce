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
        <Route
            index
            element={<h2>Admin Dashboard</h2>}
        />

        <Route
            path="products"
            element={<AdminProducts />}
        />

        <Route
            path="users"
            element={<h2>Admin Users</h2>}
        />

        <Route
            path="orders"
            element={<h2>Admin Orders</h2>}
        />
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