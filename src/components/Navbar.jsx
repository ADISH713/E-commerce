import { Link } from 'react-router-dom';
import { IconHeart, IconShoppingCart, IconSearch } from '@tabler/icons-react';
import { useSelector } from 'react-redux';

function Navbar() {
  const items = useSelector((state)=>state.cart.items);
  const cartCount = items.reduce((total,item)=>total+item.quantity,0);
  return (
    <div>
      {/* Utility bar */}
      <div className="flex items-center justify-between px-8 py-2 bg-gray-50 text-xs text-gray-600">
        <span>Free shipping on orders over <span className="text-orange-600 font-medium">1999</span></span>
        <div className="flex gap-6">
          <span>Track order</span>
          <span>Wishlist</span>
          <span>My account</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-1.5">
        <span className="text-lg font-bold text-gray-900 leading-none tracking-tight">TORQUE</span>
        </Link>

        <div className="flex gap-6 text-sm text-gray-700">
          <Link to="/products" className="text-orange-600 border-b-2 border-orange-600 pb-1">All cars</Link>
          <Link to="/products?grade=toy">Toy grade</Link>
          <Link to="/products?grade=hobby">Hobby grade</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 text-xs text-gray-400 w-36">
            <IconSearch size={14}/>
            <input type="text"
            placeholder='search here..'/>
          </div>
          <IconHeart size={18} className="text-gray-700" />
          <Link to="/cart"><IconShoppingCart size={18} className="text-gray-700 hover:text-orange-600"/>
          {cartCount>0 && ( <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>)}
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;