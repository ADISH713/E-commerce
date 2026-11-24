import React, { useEffect } from 'react';
import {BrowserRouter,useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import {setCart,clearCartState} from './redux/slices/cartSlice';
import {setWishlist,clearWishlistState} from './redux/slices/wishlistSlice';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { setUser, finishLoading } from './redux/slices/authSlice';
import { refreshSession } from './services/api';
import { getCart } from './services/cartServices';
import { getWishlist } from './services/wishlistServices';
import ScrollToTop from './components/ScrollToTop';

function App() {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const cart = useSelector((state) => state.cart);


useEffect(() => {
    refreshSession()
        .then(({ user }) => {
            dispatch(setUser(user));
        })
        .catch(() => {
            dispatch(finishLoading());
        });
}, [dispatch]);


    useEffect(() => {
    if (!user?.id) {
        return;
    }

    getCart()
        .then((existingCart) => {
            dispatch(setCart(existingCart));
        })
        .catch(() => {
            dispatch(clearCartState());
        });

    getWishlist()
    .then((existingWishlist) => {
        dispatch(setWishlist(existingWishlist));
    })
    .catch(() => {
        dispatch(clearWishlistState());
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
                <div>
                    <AppRoutes />
                </div>
                {!hideNavbar && <Footer />}
            </>
        );
    }


    return (
        <BrowserRouter>
            <ScrollToTop />
            <AppContent />
            <Toaster position="top-right" />
        </BrowserRouter>
            );
}

export default App;