import { Link, useNavigate, NavLink, useSearchParams } from 'react-router-dom';
import { IconHeart, IconShoppingCart, IconSearch, IconShoppingBag, IconAdjustmentsHorizontal, IconUser, IconX  } from '@tabler/icons-react';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { clearCartState } from '../redux/slices/cartSlice';
import { clearWishlistState } from '../redux/slices/wishlistSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';

function Navbar() {
  const items = useSelector((state)=>state.cart.items);
  const cartCount = items.reduce((total,item)=>total+item.quantity,0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get('search');
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div>
      {/* Utility bar */}
      <div className="flex items-center justify-center px-8 py-2 bg-gray-50 text-2xl text-orange-600 font-bold tracking-wider">
        TORQUE
      </div>

      {/* Main navbar */}
      <nav className="relative flex items-center justify-between px-8 h-[60px] border-b border-orange-300 shadow-md">
        <img src="/images/Logo.png" alt="Torque" className="h-16 w-auto object-contain"/>

        <div className="flex gap-7 text-m text-gray-700">
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

        <div className="flex items-center gap-7">
         <div className="relative flex items-center">

            <input
              type="text"
              autoFocus={showSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && search.trim()) {
                  navigate(`/products?search=${encodeURIComponent(search.trim())}`);
                  setShowSearch(false);
                }
              }}
              placeholder="Search cars..."
              className={`absolute right-8 px-3 py-2 pr-9 text-sm border border-gray-200 rounded-md outline-none focus:border-orange-500 bg-white shadow-sm transition-all duration-300 ${
                showSearch
                  ? 'w-56 opacity-100'
                  : 'w-0 opacity-0 pointer-events-none px-0 border-transparent'
              }`}
            />

            {showSearch && search && (
              <button
                onClick={() => {
                setSearch('');
                navigate('/products');
              }}
                className="absolute right-10 text-gray-400 hover:text-gray-700 transition z-10"
              >
                <IconX size={15} />
              </button>
            )}

            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-700 hover:text-orange-600 transition"
            >
              <IconSearch size={18} />
            </button>

          </div>
          <Link to="/wishlist">
              <IconHeart
                  size={18}
                  className="text-gray-700 hover:text-orange-600 transition"
              />
          </Link>
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
      <Link to="/orders"><IconShoppingBag size={18}
            className="text-gray-700 hover:text-orange-600 transition"/>
        </Link>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-700 hover:text-orange-600 transition"
        >
          <IconAdjustmentsHorizontal size={18} />
        </button>
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="text-gray-700 hover:text-orange-600 transition"
            >
              <IconUser size={18} />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-8 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-5 z-50">
                
                {user ? (
                  <>
                    <div className="text-center">
                      <IconUser size={32} className="mx-auto text-gray-700 mb-3" />
                      <p className="text-m font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <button
                        onClick={() => {
                          dispatch(logout());
                          dispatch(clearCartState());
                          dispatch(clearWishlistState());
                          setShowProfile(false);
                        }}
                        className="w-full bg-orange-600 text-white text-sm py-2 rounded-md hover:bg-orange-700 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <IconUser size={32} className="mx-auto text-gray-700 mb-3" />
                      <p className="text-sm font-medium text-gray-900">
                        No User
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Please login to continue
                      </p>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <button
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
            )}
          </div>
      </div>
        {showFilters && (
  <div className="absolute right-8 top-20 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-5 z-50">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-medium text-gray-900">Filters</h3>

      <button
        onClick={() => setShowFilters(false)}
        className="text-gray-400 hover:text-gray-700"
      >
        ✕
      </button>
    </div>

    <div className="mb-5">
      <p className="text-sm font-medium text-gray-700 mb-2">
        Grade
      </p>

      <div className="space-y-2 text-sm text-gray-600">
        <Link
          to="/products"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          All cars
        </Link>

        <Link
          to="/products?grade=toy"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          Toy grade
        </Link>

        <Link
          to="/products?grade=hobby"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          Hobby grade
        </Link>
      </div>
    </div>
      
        <div className="border-t pt-4 mb-5">
      <p className="text-sm font-medium text-gray-700 mb-2">
        Category
      </p>

      <div className="space-y-2 text-sm text-gray-600">
        <Link
          to="/products?category=Off-Road Buggy"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          Off-road buggy
        </Link>

        <Link
          to="/products?category=Drift car"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          Drift car
        </Link>

        <Link
          to="/products?category=Monster Truck"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          Monster truck
        </Link>

        <Link
          to="/products?category=Rock Crawler"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          Rock crawler
        </Link>
      </div>
    </div>

    <div className="border-t pt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">
        Sort by price
      </p>

      <div className="space-y-2 text-sm text-gray-600">
       <Link
          to="/products?sort=price-low"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          Low to High
        </Link>

        <Link
          to="/products?sort=price-high"
          onClick={() => setShowFilters(false)}
          className="block hover:text-orange-600"
        >
          High to Low
        </Link>
      </div>
    </div>

    <button
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

export default Navbar;