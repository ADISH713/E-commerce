import React, { useEffect } from 'react';
import {BrowserRouter,useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { getUserById } from './services/userServices';
import { setUser, logout } from './redux/slices/authSlice';
import { getCartByUserId } from './services/cartServices';
import {setCart,clearCartState} from './redux/slices/cartSlice';
import { getWishlistByUserId } from './services/wishlistServices';
import {setWishlist,clearWishlistState} from './redux/slices/wishlistSlice';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

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
            .catch((err) => {
                if (err.message === 'User not found') {
                    dispatch(logout());
                }
            });

        } catch {
            dispatch(logout());
        }

    }, [dispatch]);



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
        const showNavbar = !['/login', '/register'].includes(location.pathname) && !location.pathname.startsWith('/admin');

        const hideNavbar =
            location.pathname === '/login' ||
            location.pathname === '/register' ||
            location.pathname.startsWith('/admin') ||
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
                <div className={showNavbar ? "pt-[100px]" : ""}>
                    <AppRoutes />
                </div>
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