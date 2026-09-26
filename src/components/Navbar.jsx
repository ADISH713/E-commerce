import { Link, useNavigate, NavLink, useSearchParams } from 'react-router-dom';
import {
  IconHeart,
  IconShoppingCart,
  IconSearch,
  IconShoppingBag,
  IconUser,
  IconX,
  IconMenu2,
} from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { clearCartState } from '../redux/slices/cartSlice';
import { clearWishlistState } from '../redux/slices/wishlistSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useProducts } from '../hooks/useProducts';
import Swal from 'sweetalert2';
import { useCart } from '../hooks/useCart';

function Navbar() {
  const [searchParams] = useSearchParams();
  const { user, cart } = useCart();
  const items = cart.items;

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();

  const { data: products = [] } = useProducts();

  const searchSuggestions = search.trim()
    ? products
        .filter((product) =>
          product.name
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const params = new URLSearchParams(searchParams);

      params.set('search', search.trim());

      navigate(`/products?${params.toString()}`);

      setShowSearch(false);
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure ',
      text: 'You will be logged out of your account',
      icon: 'warning',
      width: '400px',
      padding: '1rem',
      background: '#ffffff',
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#6b7280',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        dispatch(clearCartState());
        dispatch(clearWishlistState());

        setShowProfile(false);
        setShowMobileMenu(false);

        toast.success('Logged out successfully');
      }
    });
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <div>
      {/* UTILITY BAR */}
      <div className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-50 text-sm sm:text-base md:text-lg text-orange-600 font-bold tracking-widest">
        TORQUE
      </div>

      {/* MAIN NAVBAR */}
      <nav className="relative border-b border-orange-300 shadow-md bg-white fixed top-0 left-0 right-0 z-50">
        <div className="min-h-[60px] px-3 sm:px-5 md:px-8 lg:px-10 py-2 flex items-center justify-between gap-3">

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="shrink-0"
          >
            <img
              src="/images/Logo.png"
              alt="Torque"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto max-w-[130px] sm:max-w-[160px] md:max-w-[190px] object-contain"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-7 xl:gap-9 text-sm lg:text-base text-gray-700">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative whitespace-nowrap pb-1 ${
                  isActive
                    ? 'text-orange-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-orange-600'
                    : 'hover:text-orange-600'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `relative whitespace-nowrap pb-1 ${
                  isActive
                    ? 'text-orange-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-orange-600'
                    : 'hover:text-orange-600'
                }`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative whitespace-nowrap pb-1 ${
                  isActive
                    ? 'text-orange-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-orange-600'
                    : 'hover:text-orange-600'
                }`
              }
            >
              About us
            </NavLink>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-7 shrink-0">

            {/* SEARCH */}
            <div className="relative flex items-center">

              <input
                type="text"
                autoFocus={showSearch}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search cars..."
                className={`absolute right-8 px-3 py-2 pr-9 text-sm border border-gray-200 rounded-md outline-none focus:border-orange-500 bg-white shadow-sm transition-all duration-300 ${
                  showSearch
                    ? 'w-44 lg:w-56 opacity-100'
                    : 'w-0 opacity-0 pointer-events-none px-0 border-transparent'
                }`}
              />

              {showSearch && search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    navigate('/products');
                  }}
                  className="absolute right-10 text-gray-400 hover:text-gray-700 transition z-10"
                >
                  <IconX size={15} />
                </button>
              )}

              {showSearch &&
                search.trim() &&
                searchSuggestions.length > 0 && (
                  <div className="absolute right-8 top-10 w-44 lg:w-56 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">

                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() =>
                          navigate(`/product/${product.id}`)
                        }
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition truncate"
                      >
                        {product.name}
                      </button>
                    ))}

                  </div>
                )}

              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="p-1 text-gray-700 hover:text-orange-600 transition"
              >
                <IconSearch size={18} />
              </button>

            </div>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="p-1 shrink-0"
            >
              <IconHeart
                size={18}
                className="text-gray-700 hover:text-orange-600 transition"
              />
            </Link>

            {/* CART */}
            <div className="relative shrink-0">

              <Link
                to="/cart"
                className="block p-1"
              >
                <IconShoppingCart
                  size={18}
                  className="text-gray-700 hover:text-orange-600 transition"
                />
              </Link>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}

            </div>

            {/* ORDERS */}
            <Link
              to="/orders"
              className="p-1 shrink-0"
            >
              <IconShoppingBag
                size={18}
                className="text-gray-700 hover:text-orange-600 transition"
              />
            </Link>

            {/* PROFILE */}
            <div className="relative shrink-0">

              <button
                type="button"
                onClick={() => setShowProfile(!showProfile)}
                className="p-1 text-gray-700 hover:text-orange-600 transition"
              >
                <IconUser size={18} />
              </button>

              {showProfile && (
                <ProfileDropdown
                  user={user}
                  handleLogout={handleLogout}
                  navigate={navigate}
                  setShowProfile={setShowProfile}
                />
              )}

            </div>

          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3 shrink-0">

            {/* MOBILE SEARCH */}
            <button
              type="button"
              onClick={() => {
                setShowSearch(!showSearch);
                setShowMobileMenu(false);
              }}
              className="p-1.5 text-gray-700 hover:text-orange-600 transition"
            >
              <IconSearch size={20} />
            </button>

            {/* MOBILE CART */}
            <div className="relative">

              <Link
                to="/cart"
                className="block p-1.5"
              >
                <IconShoppingCart
                  size={20}
                  className="text-gray-700 hover:text-orange-600 transition"
                />
              </Link>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}

            </div>

            {/* MOBILE PROFILE */}
            <div className="relative">

              <button
                type="button"
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowMobileMenu(false);
                }}
                className="p-1.5 text-gray-700 hover:text-orange-600 transition"
              >
                <IconUser size={20} />
              </button>

              {showProfile && (
                <ProfileDropdown
                  user={user}
                  handleLogout={handleLogout}
                  navigate={navigate}
                  setShowProfile={setShowProfile}
                />
              )}

            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
                setShowProfile(false);
              }}
              className="p-1.5 text-gray-700 hover:text-orange-600 transition"
            >
              {showMobileMenu ? (
                <IconX size={23} />
              ) : (
                <IconMenu2 size={23} />
              )}
            </button>

          </div>

        </div>

        {/* MOBILE SEARCH BAR */}
        {showSearch && (
          <div className="md:hidden px-3 sm:px-4 pb-3">

            <div className="relative">

              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search cars..."
                className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-md outline-none focus:border-orange-500 shadow-sm"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    navigate('/products');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <IconX size={16} />
                </button>
              )}

              {search.trim() &&
                searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">

                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setSearch('');
                          setShowSearch(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition truncate"
                      >
                        {product.name}
                      </button>
                    ))}

                  </div>
                )}

            </div>

          </div>
        )}

        {/* MOBILE MENU */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-sm">

            <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-1">

              <MobileNavLink
                to="/"
                label="Home"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                to="/products"
                label="Products"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                to="/about"
                label="About us"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                to="/wishlist"
                label="Wishlist"
                onClick={closeMobileMenu}
              />

              <MobileNavLink
                to="/orders"
                label="Orders"
                onClick={closeMobileMenu}
              />

            </div>

          </div>
        )}

      </nav>
    </div>
  );
}

/* PROFILE DROPDOWN */

function ProfileDropdown({
  user,
  handleLogout,
  navigate,
  setShowProfile,
}) {
  return (
    <div className="absolute right-0 top-9 w-64 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-md shadow-lg p-4 sm:p-5 z-[60]">

      {user ? (
        <>
          <div className="text-center">

            <IconUser
              size={32}
              className="mx-auto text-gray-700 mb-3"
            />

            <p className="text-base font-medium text-gray-900">
              {user.name}
            </p>

            <p className="text-sm text-gray-500 mt-1 break-words">
              {user.email}
            </p>

          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">

            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-orange-600 text-white text-sm py-2.5 rounded-md hover:bg-orange-700 transition"
            >
              Logout
            </button>

          </div>
        </>
      ) : (
        <>
          <div className="text-center">

            <IconUser
              size={32}
              className="mx-auto text-gray-700 mb-3"
            />

            <p className="text-sm font-medium text-gray-900">
              No User
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Please login to continue
            </p>

          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">

            <button
              type="button"
              onClick={() => {
                setShowProfile(false);
                navigate('/login');
              }}
              className="w-full bg-orange-600 text-white text-sm py-2.5 rounded-md hover:bg-orange-700 transition"
            >
              Login
            </button>

          </div>
        </>
      )}

    </div>
  );
}

/* MOBILE NAV LINK */

function MobileNavLink({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block py-3 text-sm border-b border-gray-100 transition ${
          isActive
            ? 'text-orange-600 font-medium'
            : 'text-gray-700 hover:text-orange-600'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default Navbar;
