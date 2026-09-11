import React, { useEffect } from 'react';
import Productlist from './pages/Productlist';
import {BrowserRouter,Routes,Route,useLocation} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductDetail from './pages/ProductDetail';
import { useSelector, useDispatch } from 'react-redux';
import { getUserById } from './services/userServices';
import { setUser, logout } from './redux/slices/authSlice';
import { getCartByUserId } from './services/cartServices';
import {setCart,clearCartState} from './redux/slices/cartSlice';
import Cart from './pages/Cart';
import ProtectedRoute from './routes/ProtectedRoute';
import Wishlist from './pages/Wishlist';
import { getWishlistByUserId } from './services/wishlistServices';
import {setWishlist,clearWishlistState} from './redux/slices/wishlistSlice';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import About from './pages/About';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound';


function App() {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const cart = useSelector((state) => state.cart);


    useEffect(() => {

        const storedAuth = localStorage.getItem('user');
        if (!storedAuth) {
            return;
        }
        try {
            const { userId } = JSON.parse(storedAuth);

            if (!userId) {
                return;
            }

            getUserById(userId)
                .then((fullUser) => {
                    dispatch(setUser(fullUser));
                })
                .catch(() => {
                    dispatch(logout());
                });

        } catch {
            dispatch(logout());
        }

    }, [dispatch]);


    // Load cart and wishlist whenever the user is available
    useEffect(() => {

        if (!user?.id) {
            return;
        }

        console.log("Logged in user:", user);

        getCartByUserId(user.id)
            .then((existingCart) => {

                if (existingCart) {
                    dispatch(setCart(existingCart));
                } else {
                    dispatch(clearCartState());
                }

            });


        getWishlistByUserId(user.id)
            .then((existingWishlist) => {

                if (existingWishlist) {
                    dispatch(setWishlist(existingWishlist));
                } else {
                    dispatch(clearWishlistState());
                }

            });

    }, [user, dispatch]);


    console.log("USER:", user);
    console.log("CART:", cart);


    function AppContent() {

        const location = useLocation();

        const hideNavbar =
            location.pathname === '/login' ||
            location.pathname === '/register' ||
            (
                ![
                    '/',
                    '/products',
                    '/login',
                    '/register',
                    '/cart',
                    '/orders',
                    '/wishlist',
                    '/checkout',
                    '/about'
                ].includes(location.pathname) &&
                !location.pathname.startsWith('/product/')
            );


        return (
            <>
                {!hideNavbar && <Navbar />}

                <Routes>

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

                {!hideNavbar && <Footer />}
            </>
        );
    }


    return (
        <BrowserRouter>

            <Toaster position="top-right" />

            <AppContent />

        </BrowserRouter>
    );
}

export default App;