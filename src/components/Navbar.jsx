import { Link, useNavigate, NavLink, useSearchParams } from 'react-router-dom';
import {
  IconHeart,
  IconShoppingCart,
  IconSearch,
  IconShoppingBag,
  IconAdjustmentsHorizontal,
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

function Navbar() {
  const [searchParams] = useSearchParams();
  const items = useSelector((state) => state.cart.items);
  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const {data:products=[]} = useProducts();
  const searchSuggestions = search.trim() ? products.filter((product)=>product.name.toLowerCase().includes(search.trim().toLowerCase())).slice(0,5):[];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set('search',search.trim());
      navigate(`/products?${params.toString()}`);
      setShowSearch(false);
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    // const confirmed = window.confirm('Are you sure you want to logout?');

    // if (!confirmed) {
    //   return;
    // }
    Swal.fire({
      title: "Are you sure ",
      text : "You will be logged out of your account",
      icon : "warning",
      width : '400px',
      padding:'1rem',
      background:'#ffffff',
      confirmButtonColor:'#ea580c',
      cancelButtonColor:'#6b7280',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'cancel',
    }).then((result)=>{
      if(result.isConfirmed){

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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/*  UTILITY BAR  */}
      <div className="flex items-center justify-center px-4 py-2 bg-gray-50 text-lg sm:text-xl md:text-2xl text-orange-600 font-bold tracking-wider">
        TORQUE
      </div>

      {/*  MAIN NAVBAR */}
      <nav className="relative border-b border-orange-300 shadow-md bg-white">
        <div className="h-[60px] px-4 sm:px-6 md:px-8 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" onClick={closeMobileMenu}>
            <img
              src="/images/Logo.png"
              alt="Torque"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP NAVIGATION  */}
          <div className="hidden md:flex items-center gap-6 lg:gap-7 text-sm lg:text-base text-gray-700">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative pb-1 ${
                  isActive
                    ? "text-orange-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-orange-600"
                    : "hover:text-orange-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `relative pb-1 ${
                  isActive
                    ? "text-orange-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-orange-600"
                    : "hover:text-orange-600"
                }`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative pb-1 ${
                  isActive
                    ? "text-orange-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-orange-600"
                    : "hover:text-orange-600"
                }`
              }
            >
              About us
            </NavLink>
          </div>

          {/*DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">

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
                    ? 'w-56 opacity-100'
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
              {showSearch && search.trim() && searchSuggestions.length > 0 && (
                <div className="absolute right-8 top-10 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                  {searchSuggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-700 hover:text-orange-600 transition"
              >
                <IconSearch size={18} />
              </button>
            </div>

            {/* WISHLIST */}
            <Link to="/wishlist">
              <IconHeart
                size={18}
                className="text-gray-700 hover:text-orange-600 transition"
              />
            </Link>

            {/* CART */}
            <div className="relative">
              <Link to="/cart">
                <IconShoppingCart
                  size={18}
                  className="text-gray-700 hover:text-orange-600 transition"
                />
              </Link>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            {/* ORDERS */}
            <Link to="/orders">
              <IconShoppingBag
                size={18}
                className="text-gray-700 hover:text-orange-600 transition"
              />
            </Link>

            {/* FILTER */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-700 hover:text-orange-600 transition"
            >
              <IconAdjustmentsHorizontal size={18} />
            </button>

            {/* PROFILE */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfile(!showProfile)}
                className="text-gray-700 hover:text-orange-600 transition"
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
          <div className="flex md:hidden items-center gap-4">

            {/* MOBILE SEARCH */}
            <button
              type="button"
              onClick={() => {
                setShowSearch(!showSearch);
                setShowMobileMenu(false);
              }}
              className="text-gray-700 hover:text-orange-600 transition"
            >
              <IconSearch size={20} />
            </button>

            {/* MOBILE CART */}
            <div className="relative">
              <Link to="/cart">
                <IconShoppingCart
                  size={20}
                  className="text-gray-700 hover:text-orange-600 transition"
                />
              </Link>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
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
                className="text-gray-700 hover:text-orange-600 transition"
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
              className="text-gray-700 hover:text-orange-600 transition"
            >
              {showMobileMenu ? (
                <IconX size={23} />
              ) : (
                <IconMenu2 size={23} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH BAR= */}
        {showSearch && (
          <div className="md:hidden px-4 pb-3">
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
              {search.trim() && searchSuggestions.length > 0 && (
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
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition"
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        )}

        {/*  MOBILE MENU */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-sm">

            <div className="px-5 py-4 space-y-1">

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

              {/* MOBILE FILTER */}
              <button
                type="button"
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 py-3 text-left text-sm text-gray-700 hover:text-orange-600 transition"
              >
                <IconAdjustmentsHorizontal size={18} />
                Filters
              </button>
            </div>
          </div>
        )}

        {/*  FILTER DROPDOWN */}
        {showFilters && (
          <div className="absolute right-4 md:right-8 top-[60px] md:top-20 w-[calc(100%-2rem)] sm:w-72 bg-white border border-gray-200 rounded-md shadow-lg p-5 z-50">

            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-gray-900">
                Filters
              </h3>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <IconX size={18} />
              </button>
            </div>

            {/* GRADE */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Grade
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <FilterLink
                  to="/products"
                  label="All cars"
                  closeFilter={() => setShowFilters(false)}
                />

                <FilterLink
                  to="/products?grade=toy"
                  label="Toy grade"
                  closeFilter={() => setShowFilters(false)}
                />

                <FilterLink
                  to="/products?grade=hobby"
                  label="Hobby grade"
                  closeFilter={() => setShowFilters(false)}
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div className="border-t pt-4 mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Category
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <FilterLink
                  to="/products?category=Off-Road Buggy"
                  label="Off-road buggy"
                  closeFilter={() => setShowFilters(false)}
                />

                <FilterLink
                  to="/products?category=Drift car"
                  label="Drift car"
                  closeFilter={() => setShowFilters(false)}
                />

                <FilterLink
                  to="/products?category=Monster Truck"
                  label="Monster truck"
                  closeFilter={() => setShowFilters(false)}
                />

                <FilterLink
                  to="/products?category=Rock Crawler"
                  label="Rock crawler"
                  closeFilter={() => setShowFilters(false)}
                />
              </div>
            </div>

            {/* SORT */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Sort by price
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <FilterLink
                  to="/products?sort=price-low"
                  label="Low to High"
                  closeFilter={() => setShowFilters(false)}
                />

                <FilterLink
                  to="/products?sort=price-high"
                  label="High to Low"
                  closeFilter={() => setShowFilters(false)}
                />
              </div>
            </div>

            {/* CLEAR FILTERS */}
            <button
              type="button"
              onClick={() => {
                setShowFilters(false);
                navigate('/products');
              }}
              className="w-full mt-5 border border-gray-300 text-sm py-2 rounded-md hover:border-orange-600 hover:text-orange-600 transition"
            >
              Clear Filters
            </button>
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
    <div className="absolute right-0 top-9 w-64 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-md shadow-lg p-5 z-[60]">

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
              className="w-full bg-orange-600 text-white text-sm py-2 rounded-md hover:bg-orange-700 transition"
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
              className="w-full bg-orange-600 text-white text-sm py-2 rounded-md hover:bg-orange-700 transition"
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


/* FILTER LINK */


function FilterLink({ to, label, closeFilter }) {
  const [searchParams] = useSearchParams();
  let finalTo = to;
  if(to !== '/products'){
    const newParams = new URLSearchParams(searchParams);
    const selectedParams = new URLSearchParams(to.split('?')[1]);

    selectedParams.forEach((value,key)=>{
      newParams.set(key,value);
    });
    finalTo = `/products?${newParams.toString()}`;
  }
  return (
    <Link
      to={finalTo}
      onClick={closeFilter}
      className="block hover:text-orange-600 transition"
    >
      {label}
    </Link>
  );
}

export default Navbar;