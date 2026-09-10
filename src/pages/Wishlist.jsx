import React ,{useState}from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconHeart, IconTrash,IconShoppingCart } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { updateWishlist } from '../services/wishlistServices';
import { setWishlist } from '../redux/slices/wishlistSlice';
import { formatPrice } from '../utils/formatPrice';
import { getCartByUserId, createCart, updateCart } from '../services/cartServices';
import { setCart } from '../redux/slices/cartSlice';
import { getProductById } from '../services/productServices';

function Wishlist() {
    const dispatch = useDispatch();
    const [cartError, setCartError] = useState(null);

    const user = useSelector((state) => state.auth.user);
    const wishlist = useSelector((state) => state.wishlist);

    const removeMutation = useMutation({
        mutationFn: async (productId) => {
            const updatedItems = wishlist.items.filter(
                (item) => String(item.id) !== String(productId)
            );

            return updateWishlist(wishlist.wishlistId, updatedItems);
        },

        onSuccess: (updatedWishlist) => {
            dispatch(setWishlist(updatedWishlist));
        },

        onError: (error) => {
            console.error('Failed to remove from wishlist:', error);

        },
    });
    //     const addToCartMutation = useMutation({
    //     mutationFn: async (item) => {
    //         const existingCart = await getCartByUserId(user.id);

    //         const currentItems = existingCart?.items || [];

    //         const existingItem = currentItems.find(
    //             (cartItem) => String(cartItem.id) === String(item.id)
    //         );

    //         let updatedItems;

    //         if (existingItem) {
    //             updatedItems = currentItems.map((cartItem) =>
    //                 String(cartItem.id) === String(item.id)
    //                     ? {
    //                         ...cartItem,
    //                         quantity: cartItem.quantity + 1
    //                     }
    //                     : cartItem
    //             );
    //         } else {
    //             updatedItems = [
    //                 ...currentItems,
    //                 {
    //                     id: item.id,
    //                     name: item.name,
    //                     price: item.price,
    //                     image: item.image,
    //                     quantity: 1
    //                 }
    //             ];
    //         }

    //         if (existingCart) {
    //             return updateCart(existingCart.id, updatedItems);
    //         }

    //         return createCart(user.id, updatedItems);
    //     },

    //     onSuccess: (updatedCart) => {
    //         dispatch(setCart(updatedCart));
    //     },

    //     onError: (error) => {
    //         console.error('Failed to add to cart:', error);
    //     },
    // });

        const addToCartMutation = useMutation({
    mutationFn: async (item) => {

        // Get the latest product data
        const product = await getProductById(item.id);

        const existingCart = await getCartByUserId(user.id);
        const currentItems = existingCart?.items || [];

        const existingItem = currentItems.find(
            (cartItem) => String(cartItem.id) === String(item.id)
        );

        let updatedItems;

        if (existingItem) {

            const newQuantity = existingItem.quantity + 1;

            if (newQuantity > product.stock) {
                throw new Error(
                    `Only ${product.stock} items are available.`
                );
            }

            updatedItems = currentItems.map((cartItem) =>
                String(cartItem.id) === String(item.id)
                    ? {
                        ...cartItem,
                        quantity: newQuantity
                    }
                    : cartItem
            );

        } else {

            if (product.stock < 1) {
                throw new Error('This product is out of stock.');
            }

            updatedItems = [
                ...currentItems,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || item.image,
                    stock: product.stock,
                    quantity: 1
                }
            ];
        }

        if (existingCart) {
            return updateCart(existingCart.id, updatedItems);
        }

        return createCart(user.id, updatedItems);
    },

    onSuccess: (updatedCart) => {
        dispatch(setCart(updatedCart));
        setCartError(null)
    },

    onError: (error,item) => {
        console.error('Failed to add to cart:', error);
         setCartError({
        productId: item.id,
        message: error.message,
    });
    },
});
    if (wishlist.items.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 text-center">
                <IconHeart size={40} className="mx-auto text-gray-400 mb-4" />

                <h2 className="text-xl font-medium text-gray-800">
                    Your wishlist is empty
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                    Products you like will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            <h1 className="text-2xl font-semibold text-gray-800 mb-8">
                My Wishlist
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {wishlist.items.map((item) => (

                    <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                    >

                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-56 object-cover"
                        />

                        <div className="p-4">
                            <div>
                            <div>
                                <h2 className="font-medium text-gray-800">
                                {item.name}
                                </h2>

                                <div className="flex items-center justify-between mt-2">
                                <p className="text-orange-600 font-medium">
                                    {formatPrice(item.price)}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => removeMutation.mutate(item.id)}
                                    disabled={removeMutation.isPending}
                                    className="text-gray-600 hover:text-red-500 transition"
                                >
                                    <IconTrash size={18} />
                                </button>
                                </div>
                            </div>

                            {String(cartError?.productId) === String(item.id) && (
                                <p className="text-sm text-red-500 mt-2">
                                {cartError.message}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                setCartError(null);
                                addToCartMutation.mutate(item);
                                }}
                                disabled={addToCartMutation.isPending}
                                className="w-full mt-4 flex items-center justify-center gap-2 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
                            >
                                <IconShoppingCart size={17} />
                                Add to Cart
                            </button>
                            </div>
                    

                        </div>

                    </div>

                ))}

            </div>
        </div>
    );
}

export default Wishlist;