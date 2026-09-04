import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productServices'
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';


function Productlist() {
    const [searchParams] = useSearchParams();
    const gradeFilter = searchParams.get('grade')
    const categoryFilter = searchParams.get('category');

    const {data:products,isLoading,isError,error} = useQuery({
        queryKey : ['products'],
        queryFn : getProducts
    });

    if(isLoading) return <p className='px-8 py-6'>Loading...</p>;
    if(isError) return <p className='px-8 py-6 text-red-600'>Error:{error.message}</p>

    const filteredProducts = products.filter((product)=>{
        const matchesGrade = gradeFilter ? product.grade === gradeFilter : true;
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        return matchesGrade && matchesCategory;
    })
  return (
    <div className='px-8 py-8'>
        <h2 className='text-2xl font-medium text-gray-900 mb-6'>{categoryFilter?categoryFilter:gradeFilter?`${gradeFilter==='hobby'?'Hobby':'Toy'} grade cars`:'RC cars'}</h2>
        {filteredProducts.length === 0?(
            <p className='text-gray-500 text-sm'>No cars matches</p>):
        (<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {filteredProducts.map((product)=>(
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
        )}
     </div>
  )
}

export default Productlist
