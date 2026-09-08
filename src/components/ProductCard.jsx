import React from 'react'
import { Link } from 'react-router-dom';
import { IconCar } from '@tabler/icons-react';
import { formatPrice } from '../utils/formatPrice';

function ProductCard({product}) {
    const isOutOfStock = product.stock === 0;
  return (
    <Link to={`/product/${product.id}`}
    className='border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 transition block'>
        <div className='bg-gray-50 h-40 relative overflow-hidden'>
            {product.images && product.images[0]?(
                <img src={product.images[0]}
                alt={product.name}
                className='w-full h-full object-cover'
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
            <p className='text-gray-500 text-xs mb-2'>{product.category}</p>
            <div className='flex items-center justify-between'>
            <p className='text-gray-900 text-sm font-medium'>{formatPrice(product.price)}</p>
            <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${product.grade === "hobby"?'bg-orange-100 text-orange-700':'bg-blue-100 text-blue-700'}`}>
                {product.grade === 'hobby'?"Hobby grade" : "Toy grade"}
            </span>
            </div>
        </div>
    </Link>
  )
}

export default ProductCard
