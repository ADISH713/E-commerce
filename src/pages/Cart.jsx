import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { updateCart } from '../services/cartServices';
import { setCart } from '../redux/slices/cartSlice';
import Swal from 'sweetalert2';

function Cart() {
    const dispatch = useDispatch();
    const { items, cartId } = useSelector((state) => state.cart);

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const increaseQuantity = async (item) => {
        if (item.quantity >= item.stock) return;

        const updatedItems = items.map((cartItem) =>
            cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );

        try {
            const updatedCart = await updateCart(cartId, updatedItems);
            dispatch(setCart(updatedCart));
        } catch (error) {
            console.error("failed to increase quantity : error");
        }
    };

    const decreaseQuantity = async (item) => {
        if (item.quantity <= 1) return;

        const updatedItems = items.map((cartItem) =>
            cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
        );

        try {
            const updatedCart = await updateCart(cartId, updatedItems);
            dispatch(setCart(updatedCart));
        } catch (error) {
            console.error('Failed to decrease quantity:', error);
        }
    };

    const removeItem = async (item) => {
            const result = await Swal.fire({
            title: 'Remove item?',
            text: `Are you sure you want to remove ${item.name} from your cart?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Remove',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#6b7280',
            width: '400px',
        });

        if (!result.isConfirmed) return;

        const updatedItems = items.filter(
            (cartItem) => String(cartItem.id) !== String(item.id)
        );

        try {
            const updatedCart = await updateCart(cartId, updatedItems);
            dispatch(setCart(updatedCart));

            Swal.fire({
            title: 'Removed!',
            text: `${item.name} has been removed from your cart.`,
            icon: 'success',
            confirmButtonColor: '#ea580c',
            });
            
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    if (items.length === 0) {
        return (
            <div className='px-5 sm:px-8 lg:px-12 py-12 sm:py-16 text-center'>
                <h1 className='text-2xl font-medium text-gray-900 mb-2'>
                    Your cart is emty
                </h1>

                <p className='text-gray-500 text-sm mb-6'>
                    Add some RC cars to your cart
                </p>

                <Link
                    to='/products'
                    className='inline-block bg-orange-600 text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-orange-700 transition'
                >
                    Continue shopping
                </Link>
            </div>
        );
    }

    return (
        <div className='px-5 sm:px-8 lg:px-12 py-6 sm:py-8'>

            <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-6">
                Shopping Cart
            </h1>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto'>

                {/* Cart products */}
                <div className='lg:col-span-2 space-y-4'>

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className='border border-gray-200 hover:border-orange-300 rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4'
                        >

                            <div className='w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0'>
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        No image
                                    </div>
                                )}
                            </div>

                            <div className='flex-1'>

                                <h2 className="text-sm font-medium text-gray-900 mb-1">
                                    {item.name}
                                </h2>

                                <p className='text-sm text-gray-500 mb-3'>
                                    {formatPrice(item.price)}
                                </p>

                                <div className='flex items-center justify-between'>

                                    <div className='flex items-center border border-gray-200 rounded-md'>

                                        <button
                                            type='button'
                                            onClick={() => decreaseQuantity(item)}
                                            className="p-2 hover:bg-gray-50"
                                        >
                                            <IconMinus size={14} />
                                        </button>

                                        <span className='px-4 text-sm'>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type='button'
                                            onClick={() => increaseQuantity(item)}
                                            className="p-2 hover:bg-gray-50"
                                        >
                                            <IconPlus size={14} />
                                        </button>

                                        <button
                                            type='button'
                                            onClick={() => removeItem(item)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition"
                                        >
                                            <IconTrash size={17} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

                {/* Order Summary */}
                <div className="border border-orange-300 shadow-md rounded-xl p-5 h-fit">

                    <h2 className="text-sm font-medium text-gray-900 mb-5">
                        Order Summary
                    </h2>

                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-500">
                            Subtotal
                        </span>

                        <span className="text-gray-900 font-medium">
                            {formatPrice(subtotal)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm mb-4">
                        <span className="text-gray-500">
                            Shipping
                        </span>

                        <span className="text-green-600">
                            Free
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between">

                        <span className="text-sm font-medium text-gray-900">
                            Total
                        </span>

                        <span className="text-lg font-medium text-gray-900">
                            {formatPrice(subtotal)}
                        </span>

                    </div>

                    <Link
                        to="/checkout"
                        className="block w-full mt-5 bg-orange-600 text-white text-sm font-medium py-3 rounded-md hover:bg-orange-700 transition text-center"
                    >
                        Proceed to checkout
                    </Link>

                    <Link
                        to="/products"
                        className="block text-center text-xs text-gray-500 mt-4 hover:text-gray-900"
                    >
                        Continue shopping
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Cart