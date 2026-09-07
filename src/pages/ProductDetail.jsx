import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState,useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../services/productServices';
import { formatPrice } from '../utils/formatPrice';
import { IconCar, IconMinus, IconPlus } from '@tabler/icons-react';
import {useDispatch, useSelector} from 'react-redux'
import { createCart,updateCart,getCartByUserId } from '../services/cartServices';
import { setCart } from '../redux/slices/cartSlice';

function ProductDetail() {
    const {id} = useParams();
    const [selectedImage,setSelectedIamge] = useState(0);
    const [quantity,setQuantity] = useState(1);
    const addingToCartRef = useRef(false);
    const navigate  = useNavigate();
    const dispatch = useDispatch()

    const user = useSelector((state)=>state.auth.user);
   

    const {data:product,isLoading,isError,error}=useQuery({
        queryKey : ['product',id],
        queryFn : () => getProductById(id),
    });

//     const addToCartMutation = useMutation({
//   mutationFn: async () => {
//     const existingCart = await getCartByUserId(user.id);
    
//     // const currentItems = existingCart ? existingCart.items : [];
//     const currentItems = existingCart?.items || [];
//     // const existingItem = currentItems.find((item) => item.id === product.id);
//     const existingItem = currentItems.find((item)=>String(item.id)===String(product.id));
     

//     let newItems;
//     if (existingItem) {
    
//     const newQuantity = existingItem.quantity + quantity;
//       if (newQuantity > product.stock) {
//         throw new Error(
//           `Only ${product.stock} item are available.`
//         );
//       }

//       // newItems = currentItems.map((item) =>
//       //   item.id === product.id
//       //     ? { ...item, quantity: item.quantity + quantity }
//       //     : item
//       // );
//        newItems = currentItems.map((item) =>
//         String(item.id) === String(product.id)
//           ? {
//               ...item,
//               quantity: newQuantity,
//             }
//           : item
//       );
//     } else {
//       newItems = [
//         ...currentItems,
//         {
//           id: product.id,
//           name: product.name,
//           price: product.price,
//           image: product.images?.[0] || '',
//           stock: product.stock,
//           quantity: quantity,
//         },
//       ];
//     }

// if (existingCart) {
//       return updateCart(existingCart.id, newItems);
//     }

//     return createCart(user.id, newItems);
//   },
//   onSuccess: (updatedCart) => {
//     dispatch(setCart(updatedCart));
//     addingToCartRef.current = false;
//   },

//   onError: (error)=>{
//     console.error('Add to cart error:',error);
//     addingToCartRef.current = false;
//   }
// });

const cart = useSelector((state) => state.cart);

const addToCartMutation = useMutation({
  mutationFn: async () => {
    const currentItems = cart.items || [];
    const existingItem = currentItems.find((item) => String(item.id) === String(product.id));

    let newItems;
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new Error(`Only ${product.stock} item are available.`);
      }
      newItems = currentItems.map((item) =>
        String(item.id) === String(product.id)
          ? { ...item, quantity: newQuantity }
          : item
      );
    } else {
      newItems = [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          stock: product.stock,
          quantity: quantity,
        },
      ];
    }

    if (cart.cartId) {
      return updateCart(cart.cartId, newItems);
    }
    return createCart(user.id, newItems);
  },
  onSuccess: (updatedCart) => {
    dispatch(setCart(updatedCart));
    addingToCartRef.current = false;
  },
  onError: (error) => {
    console.error('Add to cart error:', error);
    addingToCartRef.current = false;
  }
});

    if(isLoading) return <p className='px-8 py-6'>Loading product...</p>;
    if(isError) return <p className='px-8 py-6 text-red-600'>Error:{error.message}</p>
    const isOutOfStock = product.stock === 0;
    const increaseQty = ()=>{
        if(quantity<product.stock) setQuantity(quantity + 1);
    }
    
    const decreaseQty = ()=>{
        if(quantity>1) setQuantity(quantity - 1)
    };

//    const handleAddToCart = () => {
//   if (!user) {
//     navigate('/login');
//     return;
//   }
//   addToCartMutation.mutate();
// };

const handleAddToCart = (e) => {
  e.preventDefault();
  console.log('Button cliked');

  if (!user) {
    navigate('/login');
    return;
  }

  if (addingToCartRef.current) {
    return;
  }

  addingToCartRef.current = true;
  addToCartMutation.mutate();
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
        <p className="text-2xl font-medium text-gray-900 mb-4">{formatPrice(product.price)}</p>

        {isOutOfStock ? (
          <p className="text-red-600 text-sm font-medium mb-6">Out of stock</p>
        ) : (
          <p className="text-green-600 text-sm font-medium mb-6">In stock ({product.stock} available)</p>
        )}

        {/* Quantity selector */}
        {!isOutOfStock && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-700">Quantity</span>
            <div className="flex items-center border border-gray-200 rounded-md">
              <button type='button' onClick={decreaseQty} className="p-2">
                <IconMinus size={14} />
              </button>
              <span className="px-4 text-sm">{quantity}</span>
              <button type='button' onClick={increaseQty} className="p-2">
                <IconPlus size={14} />
              </button>
            </div>
          </div>
        )}

        <button
        type='button'
        onClick={handleAddToCart}
          disabled={isOutOfStock || addToCartMutation.isPending}  
          className={`w-full py-3 rounded-md text-sm font-medium mb-8 ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700 transition'
          }`}
        >
          {isOutOfStock ? 'Out of stock' : addToCartMutation.isPending ? 'Adding...':'Add to cart'}
        </button>

        {/* Specs */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Specifications</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-500">Scale</span>
            <span className="text-gray-900">{product.specs.scale}</span>
            <span className="text-gray-500">Top speed</span>
            <span className="text-gray-900">{product.specs.speed}</span>
            <span className="text-gray-500">Battery</span>
            <span className="text-gray-900">{product.specs.battery}</span>
            <span className="text-gray-500">Runtime</span>
            <span className="text-gray-900">{product.specs.runtime}</span>
            <span className="text-gray-500">Drive type</span>
            <span className="text-gray-900">{product.specs.driveType}</span>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>

    </div>
  )
}

export default ProductDetail
