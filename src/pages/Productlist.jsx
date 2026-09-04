import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productServices'
import ProductCard from '../components/ProductCard';

function Productlist() {
    const {data:products,isLoading,isError,error} = useQuery({
        queryKey : ['products'],
        queryFn : getProducts
    });

    if(isLoading) return <p className='px-8 py-6'>Loading...</p>;
    if(isError) return <p className='px-8 py-6 text-red-600'>Error:{error.message}</p>
  return (
    <div className='px-8 py-8'>
        <h2 className='text-2xl font-medium text-gray-900 mb-6'>RC Cars</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {products.map((product)=>(
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
     </div>
  )
}

export default Productlist
