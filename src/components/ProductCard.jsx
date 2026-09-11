import React from 'react'
import { Link } from 'react-router-dom';
import { IconCar,IconHeart } from '@tabler/icons-react';
import { formatPrice } from '../utils/formatPrice';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { setWishlist } from '../redux/slices/wishlistSlice';
import {createWishlist,updateWishlist} from '../services/wishlistServices';
import { toast } from 'react-hot-toast';
import { motion, scale } from 'motion/react';

function ProductCard({product}) {
    const isOutOfStock = product.stock === 0;
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.auth.user);
    const wishlist = useSelector((state)=>state.wishlist);
    const isWishlisted = wishlist.items.some((item)=>String(item.id)===String(product.id));

    const wishlistMutation = useMutation({
    mutationFn: async () => {

        if (!user) {
            throw new Error('Please login to use wishlist');
        }

        const updatedItems = isWishlisted
            ? wishlist.items.filter(
                (item) => String(item.id) !== String(product.id)
            )
            : [...wishlist.items, {id:product.id,name:product.name,price:product.price,image:product.images?.[0] || '',}];

        if (wishlist.wishlistId) {
            return updateWishlist(
                wishlist.wishlistId,
                updatedItems
            );
        }

        return createWishlist(
            user.id,
            updatedItems
        );
    },

    onSuccess: (updatedWishlist) => {
        dispatch(setWishlist(updatedWishlist));

        toast.success(
            isWishlisted
                ? 'Removed from wishlist'
                : 'Added to wishlist'
        );
    },

    onError: (error) => {
        toast.error(error.message);
    }
});
  return (
    <Link to={`/product/${product.id}`}>
         <motion.div
            className="border border-gray-200 rounded-xl overflow-hidden"
            whileHover={{
                y: -5,
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
            }}
            transition={{
                duration: 0.2
            }}
        >
        <div className='bg-gray-50 h-40 relative overflow-hidden'>
            {product.images && product.images[0]?(
                <motion.img src={product.images[0]}
                alt={product.name}
                className='w-full h-full object-cover'
                whileHover={{scale:1.05}}
                transition={{duration:0.3}}
                />
            ):(
                <div className='w-full h-full flex items-center justify-center'>
                    <IconCar size={48} className='text-gray-300' stroke={1.5}/>
                </div>
            )}
            
            {isOutOfStock &&(
                <span className='absolute top-2 right-2 text-[10px] font-medium px-2 py-1 rounded-full bg-gray-800 text-white'>Out of stock</span>
            )}
        </div>

        <div className='p-3'>
            <p className='text-gray-900 text-sm font-medium mb-1 truncate'>{product.name}</p>
            <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-xs">
                    {product.category}
                </p>

                <motion.button
                    type="button"
                    whileHover={{scale:1.15}}
                    whileTap={{scale:0.85}}
                    disabled={wishlistMutation.isPending}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!user) {
                            toast.error('Please login to use wishlist');
                            return;
                        }

                        wishlistMutation.mutate();
                    }}
                    className="text-gray-500 hover:text-orange-500 transition"
                >
                    <IconHeart
                        size={18}
                        fill={isWishlisted ? "currentColor" : "none"}
                        className={isWishlisted ? "text-orange-500" : ""}
                    />
                </motion.button>
            </div>
            <div className="text-orange-500 text-sm tracking-wide mb-2">
                {'★'.repeat(Math.round(product.rating))} <span className='text-xs text-gray-500'>({product.reviewsCount})</span>
            </div>
            <div className='flex items-center justify-between'>
            <p className='text-gray-900 text-sm font-medium'>{formatPrice(product.price)}</p>
            <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${product.grade === "hobby"?'bg-orange-100 text-orange-700':'bg-blue-100 text-blue-700'}`}>
                {product.grade === 'hobby'?"Hobby grade" : "Toy grade"}
            </span>
            </div>
        </div>
        </motion.div>
    </Link>
  )
}

export default ProductCard
