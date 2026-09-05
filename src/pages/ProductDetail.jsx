import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/productServices';
import { IconCar } from '@tabler/icons-react';

function ProductDetail() {
    const {id} = useParams();
    const [selectedImage,setSelectedIamge] = useState(0);
    const [quantity,setQuantity] = useState(1);

    const {data:product,isLoading,isError,error}=useQuery({
        queryKey : ['product',id],
        queryFn : () => getProductById(id),
    });

    if(isLoading) return <p className='px-8 py-6'>Loading product...</p>;
    if(isError) return <p className='px-8 py-6 text-red-600'>Error:{error.message}</p>
    const outOfStock = product.stock === 0;
    const increaseQty = ()=>{
        if(quantity<product.stock) setQuantity(quantity + 1);
    }
    
    const decreaseQty = ()=>{
        if(quantity>1) setQuantity(quantity - 1)
    };

  return (
    <div className='px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div>
            <div className='bg-gray-50 rounded-xl h-96 flex items-center justify-center overflow-hidden mb-4'>
                {product.images && product.images[selectedImage] ? (
                    <img src = {product.images[selectedImage]}
                    alt = {product.name}
                    className='w-full h-full object-cover'
                />
                ):(<IconCar size={80} className='text-gray-300' stroke={1.5}/>)}
            </div>

            {product.images && product.images.length>1 && (
                <div className='flex gap-2'>
                    {product.images.map((img,index)=>(
                        <button key={index} onClick={()=>setSelectedIamge(index)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                            selectedImage === index ? 'border-orange-500': 'border-gray-200'
                        }`}>
                            <img src={img} alt={`${product.name} ${index + 1}`}  className='w-full h-full object-cover'/>
                        </button>
                    ))}
                </div>
            )}
        </div>
      
      <div>
        <span className={`inline-block text-[10px] font-medium px-2 py-1 rounded-full mb-3 ${
        product.grade === 'hobby'? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
            {product.grade === 'hobby' ? 'Hobby grade' : 'Toy grade'}
        </span>

        <h1 className='text-2xl font-medium text-gray-900 mb-1'>{product.name}</h1>
        <p className='text-gray-500 text-sm mb-4'>{product.brand} {product.category}</p>
{/* 
        {isOutOfStock ? (
            <p className='text-red-600 text-sm font-medium mb-6'>Out of stock</p>
        ):(<p className='text-green-600 text-sm font-medium mb-6'>In stock {product.stock} available</p>)} */}
      </div>

    </div>
  )
}

export default ProductDetail
