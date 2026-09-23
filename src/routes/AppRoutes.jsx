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
import UserProtectedRoute from './UserProtectedRoute';

import AdminLayout from '../admin/AdminLayout';
import AdminProducts from '../admin/pages/AdminProducts';
import AddProduct from '../admin/pages/AddProduct';
import EditProduct from '../admin/pages/EditProduct';
import AdminUsers from '../admin/pages/AdminUsers';
import AdminOrders from '../admin/pages/AdminOrders';
import AdminDashboard from '../admin/pages/AdminDashboard';
import AdminTrash from '../admin/pages/AdminTrash';

function AppRoutes() {
    return (
        <Routes>
            {/*  ADMIN ROUTES  */}

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

                <Route
                    path="products/add"
                    element={<AddProduct />}
                />

                <Route
                    path="products/edit/:id"
                    element={<EditProduct />}
                />

                <Route
                    path="users"
                    element={<AdminUsers />}
                />

                <Route
                    path="orders"
                    element={<AdminOrders />}
                />

                <Route
                    path="trash"
                    element={<AdminTrash />}
                />
            </Route>

            {/*  PUBLIC AUTH ROUTES  */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/*  CUSTOMER ROUTES  */}

            <Route
                path="/"
                element={
                    <UserProtectedRoute>
                        <Home />
                    </UserProtectedRoute>
                }
            />

            <Route
                path="/products"
                element={
                    <UserProtectedRoute>
                        <Productlist />
                    </UserProtectedRoute>
                }
            />

            <Route
                path="/product/:id"
                element={
                    <UserProtectedRoute>
                        <ProductDetail />
                    </UserProtectedRoute>
                }
            />

            <Route
                path="/cart"
                element={
                    <UserProtectedRoute>
                        <Cart />
                    </UserProtectedRoute>
                }
            />

            <Route
                path="/orders"
                element={
                    <UserProtectedRoute>
                        <Orders />
                    </UserProtectedRoute>
                }
            />

            <Route
                path="/wishlist"
                element={
                    <UserProtectedRoute>
                        <Wishlist />
                    </UserProtectedRoute>
                }
            />

            <Route
                path="/checkout"
                element={
                    <UserProtectedRoute>
                        <Checkout />
                    </UserProtectedRoute>
                }
            />

            <Route
                path="/about"
                element={
                    <UserProtectedRoute>
                        <About />
                    </UserProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
}

export default AppRoutes;