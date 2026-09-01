import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productServices'

function Productlist() {
    const {data:products,isLoading,isError,error} = useQuery({
        queryKey : ['products'],
        queryFn : getProducts
    });

    if(isLoading) return <p>Loading...</p>;
    if(isError) return <p>Error:{error.message}</p>
  return (
    <div>
     <h2>RC CARS</h2>
     <ul>
        {products.map((product)=>(
            <li key={product.id}>
                <strong>{product.name}</strong> - {product.price} ({product.category})
            </li>
        ))}
     </ul>
    </div>
  )
}

export default Productlist
