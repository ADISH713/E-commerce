import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    IconArrowLeft,
    IconLock,
    IconMail,
    IconUser,
    IconPhone,
    IconHome,
    IconMapPin,
    IconMap,
    IconShieldCheck,
    IconTruck,
    IconRefresh,
} from '@tabler/icons-react';
import { formatPrice } from '../utils/formatPrice';
import {
    IconCreditCard,
    IconWallet,
    IconCash,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../services/orderServices';
import { clearCartState } from '../redux/slices/cartSlice';
import { updateCart } from '../services/cartServices';
import {
    getProductById,
    updateProduct,
} from '../services/productServices';
import toast from 'react-hot-toast';

function Checkout() {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');

    const { items, cartId } = useSelector((state) => state.cart);
    const user = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
    });

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = 0;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();

        setStep(2);
    };

    const handlePlaceOrder = async () => {
        try {
            // Get latest stock from backend
            const latestProducts = await Promise.all(
                items.map((item) =>
                    getProductById(item.id)
                )
            );

            // Check stock before placing order
            latestProducts.forEach((product, index) => {
                const orderedQuantity = items[index].quantity;

                if (orderedQuantity > product.stock) {
                    throw new Error(
                        `Only ${product.stock} ${product.name} available.`
                    );
                }
            });

            const orderData = {
                userId: user.id,
                items: items,
                shippingAddress: formData,
                paymentMethod: paymentMethod,
                subtotal: subtotal,
                shipping: shipping,
                total: total,
                status: "pending",
                createdAt: new Date().toISOString(),
            };

            // 1. Create order
            await createOrder(orderData);

            // 2. Reduce stock
            await Promise.all(
                latestProducts.map((product, index) => {
                    const orderedQuantity = items[index].quantity;

                    return updateProduct(product.id, {
                        stock: product.stock - orderedQuantity,
                    });
                })
            );

            // 3. Clear cart
            if (cartId) {
                await updateCart(cartId, []);
            }

            dispatch(clearCartState());

            toast.success("Order placed successfully!");

        } catch (error) {
            console.error("Failed to place order:", error);

            toast.error(
                error.message || "Failed to place order. Please try again."
            );
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
                <div className="text-center w-full max-w-md">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
                        Your cart is empty
                    </h1>

                    <p className="text-sm text-gray-500 mb-6 px-2">
                        Add some RC cars before proceeding to checkout.
                    </p>

                    <Link
                        to="/products"
                        className="inline-block bg-orange-600 text-white text-sm font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-orange-700 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-7 lg:py-8">

                {/* Back to cart */}

                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 mb-6 sm:mb-8"
                >
                    <IconArrowLeft size={16} />
                    Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 sm:gap-10 lg:gap-12">

                    {/* LEFT SIDE */}

                    <div className="min-w-0">

                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8">
                            Checkout
                        </h1>

                        {/* Steps */}

                        <div className="flex items-center gap-2 sm:gap-4 mb-8 sm:mb-10 overflow-x-auto scrollbar-none pb-1">

                            {/* Shipping */}

                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                                        step >= 1
                                            ? 'bg-orange-600 text-white'
                                            : 'border border-gray-300 text-gray-500'
                                    }`}
                                >
                                    1
                                </span>

                                <span
                                    className={`text-xs sm:text-sm whitespace-nowrap ${
                                        step >= 1
                                            ? 'font-medium text-orange-600'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    Shipping
                                </span>
                            </div>

                            <div className="h-px w-6 sm:w-12 bg-gray-200 shrink-0"></div>

                            {/* Payment */}

                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                                        step >= 2
                                            ? 'bg-orange-600 text-white'
                                            : 'border border-gray-300 text-gray-500'
                                    }`}
                                >
                                    2
                                </span>

                                <span
                                    className={`text-xs sm:text-sm whitespace-nowrap ${
                                        step >= 2
                                            ? 'font-medium text-orange-600'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    Payment
                                </span>
                            </div>

                            <div className="h-px w-6 sm:w-12 bg-gray-200 shrink-0"></div>

                            {/* Review */}

                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                                        step >= 3
                                            ? 'bg-orange-600 text-white'
                                            : 'border border-gray-300 text-gray-500'
                                    }`}
                                >
                                    3
                                </span>

                                <span
                                    className={`text-xs sm:text-sm whitespace-nowrap ${
                                        step >= 3
                                            ? 'font-medium text-orange-600'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    Review
                                </span>
                            </div>

                        </div>

                        {/* STEP 1 - SHIPPING */}

                        {step === 1 && (
                            <form onSubmit={handleShippingSubmit}>

                                {/* Contact Information */}

                                <section className="mb-6 sm:mb-8">

                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                                        Contact Information
                                    </h2>

                                    <div className="relative">
                                        <IconMail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email address"
                                            required
                                            className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3.5 sm:py-4 text-sm outline-none focus:border-orange-500 transition"
                                        />
                                    </div>

                                </section>

                                {/* Shipping Address */}

                                <section>

                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                                        Shipping Address
                                    </h2>

                                    <div className="space-y-3 sm:space-y-4">

                                        {/* Full Name */}

                                        <div className="relative">
                                            <IconUser
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Full Name"
                                                required
                                                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3.5 sm:py-4 text-sm outline-none focus:border-orange-500 transition"
                                            />
                                        </div>

                                        {/* Phone */}

                                        <div className="relative">
                                            <IconPhone
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Phone Number"
                                                required
                                                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3.5 sm:py-4 text-sm outline-none focus:border-orange-500 transition"
                                            />
                                        </div>

                                        {/* Address 1 */}

                                        <div className="relative">
                                            <IconHome
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                name="addressLine1"
                                                value={formData.addressLine1}
                                                onChange={handleChange}
                                                placeholder="Address Line 1"
                                                required
                                                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3.5 sm:py-4 text-sm outline-none focus:border-orange-500 transition"
                                            />
                                        </div>

                                        {/* Address 2 */}

                                        <div className="relative">
                                            <IconHome
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                name="addressLine2"
                                                value={formData.addressLine2}
                                                onChange={handleChange}
                                                placeholder="Address Line 2 (Optional)"
                                                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3.5 sm:py-4 text-sm outline-none focus:border-orange-500 transition"
                                            />
                                        </div>

                                        {/* City, State */}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                                            <div className="relative">
                                                <IconMapPin
                                                    size={18}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                />

                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    placeholder="City"
                                                    required
                                                    className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3.5 sm:py-4 text-sm outline-none focus:border-orange-500 transition"
                                                />
                                            </div>

                                            <div className="relative">
                                                <IconMap
                                                    size={18}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                />

                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    placeholder="State"
                                                    required
                                                    className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3.5 sm:py-4 text-sm outline-none focus:border-orange-500 transition"
                                                />
                                            </div>

                                        </div>

                                        {/* Pincode */}

                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="ZIP / Postal Code"
                                            required
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3.5 sm:py-4 text-sm outline-none focus:border-orange-500 transition"
                                        />

                                    </div>

                                </section>

                                {/* Continue */}

                                <button
                                    type="submit"
                                    className="w-full mt-6 sm:mt-8 bg-orange-600 text-white font-medium py-3 sm:py-3.5 rounded-lg hover:bg-orange-700 transition text-sm sm:text-base"
                                >
                                    Continue to Payment
                                </button>

                            </form>
                        )}

                        {/* STEP 2 - PAYMENT */}

                        {step === 2 && (
                            <div className="space-y-5 sm:space-y-6">

                                <div>
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Payment Method
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Choose how you would like to pay for your order.
                                    </p>
                                </div>

                                {/* Cash on Delivery */}

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`w-full flex items-center gap-3 sm:gap-4 border rounded-lg p-3.5 sm:p-4 text-left ${
                                        paymentMethod === 'cod'
                                            ? 'border-orange-600 bg-orange-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <IconCash size={22} className="shrink-0" />

                                    <div className="min-w-0">
                                        <p className="font-medium text-sm sm:text-base">
                                            Cash on Delivery
                                        </p>

                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                            Pay when your order arrives
                                        </p>
                                    </div>
                                </button>

                                {/* UPI */}

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`w-full flex items-center gap-3 sm:gap-4 border rounded-lg p-3.5 sm:p-4 text-left ${
                                        paymentMethod === 'upi'
                                            ? 'border-orange-600 bg-orange-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <IconWallet size={22} className="shrink-0" />

                                    <div className="min-w-0">
                                        <p className="font-medium text-sm sm:text-base">
                                            UPI
                                        </p>

                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                            Pay using UPI
                                        </p>
                                    </div>
                                </button>

                                {/* Card */}

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`w-full flex items-center gap-3 sm:gap-4 border rounded-lg p-3.5 sm:p-4 text-left ${
                                        paymentMethod === 'card'
                                            ? 'border-orange-600 bg-orange-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <IconCreditCard size={22} className="shrink-0" />

                                    <div className="min-w-0">
                                        <p className="font-medium text-sm sm:text-base">
                                            Credit / Debit Card
                                        </p>

                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                            Pay securely using your card
                                        </p>
                                    </div>
                                </button>

                                {/* Card fields */}

                                {paymentMethod === 'card' && (
                                    <div className="space-y-3 sm:space-y-4">

                                        <input
                                            type="text"
                                            placeholder="Card Number"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                                        />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                                            <input
                                                type="text"
                                                placeholder="MM / YY"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                                            />

                                            <input
                                                type="text"
                                                placeholder="CVV"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                                            />

                                        </div>

                                    </div>
                                )}

                                {/* Navigation */}

                                <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4">

                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-md text-sm"
                                    >
                                        Back to Shipping
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!paymentMethod) {
                                                toast.error('Please select a payment method.');
                                                return;
                                            }

                                            setStep(3);
                                        }}
                                        className="w-full sm:flex-1 bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 text-sm"
                                    >
                                        Continue to Review
                                    </button>

                                </div>

                            </div>
                        )}

                        {/* STEP 3 - REVIEW */}

                        {step === 3 && (
                            <div className="space-y-6 sm:space-y-8">

                                {/* Review */}

                                <div>
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Review Your Order
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Check your details before placing the order.
                                    </p>
                                </div>

                                {/* Shipping Information */}

                                <section className="border border-gray-200 rounded-lg p-4 sm:p-5">

                                    <div className="flex items-start justify-between gap-3 mb-4">

                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                                            Shipping Information
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-sm text-orange-600 hover:text-orange-700 shrink-0"
                                        >
                                            Edit
                                        </button>

                                    </div>

                                    <div className="space-y-1 text-sm text-gray-600 break-words">

                                        <p className="font-medium text-gray-900">
                                            {formData.fullName}
                                        </p>

                                        <p>{formData.email}</p>

                                        <p>{formData.phone}</p>

                                        <p>{formData.addressLine1}</p>

                                        {formData.addressLine2 && (
                                            <p>{formData.addressLine2}</p>
                                        )}

                                        <p>
                                            {formData.city}, {formData.state} - {formData.pincode}
                                        </p>

                                    </div>

                                </section>

                                {/* Payment Information */}

                                <section className="border border-gray-200 rounded-lg p-4 sm:p-5">

                                    <div className="flex items-start justify-between gap-3 mb-4">

                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                                            Payment Method
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="text-sm text-orange-600 hover:text-orange-700 shrink-0"
                                        >
                                            Edit
                                        </button>

                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-700">

                                        {paymentMethod === 'cod' && (
                                            <>
                                                <IconCash size={20} className="shrink-0" />
                                                <span>Cash on Delivery</span>
                                            </>
                                        )}

                                        {paymentMethod === 'upi' && (
                                            <>
                                                <IconWallet size={20} className="shrink-0" />
                                                <span>UPI</span>
                                            </>
                                        )}

                                        {paymentMethod === 'card' && (
                                            <>
                                                <IconCreditCard size={20} className="shrink-0" />
                                                <span>Credit / Debit Card</span>
                                            </>
                                        )}

                                    </div>

                                </section>

                                {/* Items */}

                                <section className="border border-gray-200 rounded-lg p-4 sm:p-5">

                                    <h3 className="font-medium text-gray-900 mb-4 text-sm sm:text-base">
                                        Order Items
                                    </h3>

                                    <div className="space-y-4">

                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-start justify-between gap-4"
                                            >

                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 break-words">
                                                        {item.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>

                                                <p className="text-sm font-medium text-gray-900 shrink-0">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>

                                            </div>
                                        ))}

                                    </div>

                                </section>

                                {/* Place Order */}

                                <div className="flex flex-col sm:flex-row gap-3 pt-1 sm:pt-2">

                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-md text-sm"
                                    >
                                        Back to Payment
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handlePlaceOrder}
                                        className="w-full sm:flex-1 bg-orange-600 text-white font-medium py-3 rounded-md hover:bg-orange-700 transition text-sm sm:text-base"
                                    >
                                        Place Order
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="min-w-0">

                        <div className="border border-gray-200 rounded-xl p-4 sm:p-5 lg:p-6 lg:sticky lg:top-6">

                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5 sm:mb-6">
                                Order Summary
                            </h2>

                            {/* Cart Items */}

                            <div className="space-y-4 sm:space-y-5">

                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-3 sm:gap-4"
                                    >

                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">

                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                    No image
                                                </div>
                                            )}

                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <h3 className="text-sm font-medium text-gray-900 break-words">
                                                {item.name}
                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Quantity: {item.quantity}
                                            </p>

                                            <p className="text-sm font-medium text-gray-900 mt-2">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>

                                        </div>

                                    </div>
                                ))}

                            </div>

                            {/* Price Summary */}

                            <div className="border-t border-gray-200 mt-5 sm:mt-6 pt-4 sm:pt-5">

                                <div className="flex justify-between gap-4 text-sm mb-4">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-gray-900 shrink-0">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 text-sm mb-4">
                                    <span className="text-gray-500">
                                        Shipping
                                    </span>

                                    <span className="text-green-600 shrink-0">
                                        Free
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 sm:pt-5 flex justify-between gap-4">

                                    <span className="font-semibold text-gray-900">
                                        Total
                                    </span>

                                    <span className="text-lg sm:text-xl font-semibold text-orange-600 shrink-0">
                                        {formatPrice(total)}
                                    </span>

                                </div>

                            </div>

                            {/* Trust Features */}

                            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-gray-100">

                                <div className="text-center min-w-0">
                                    <IconShieldCheck
                                        size={22}
                                        className="mx-auto text-orange-600 mb-2"
                                    />

                                    <p className="text-[11px] sm:text-xs text-gray-600">
                                        Secure
                                    </p>

                                    <p className="text-[11px] sm:text-xs text-gray-600">
                                        Checkout
                                    </p>
                                </div>

                                <div className="text-center min-w-0">
                                    <IconTruck
                                        size={22}
                                        className="mx-auto text-orange-600 mb-2"
                                    />

                                    <p className="text-[11px] sm:text-xs text-gray-600">
                                        Free
                                    </p>

                                    <p className="text-[11px] sm:text-xs text-gray-600">
                                        Shipping
                                    </p>
                                </div>

                                <div className="text-center min-w-0">
                                    <IconRefresh
                                        size={22}
                                        className="mx-auto text-orange-600 mb-2"
                                    />

                                    <p className="text-[11px] sm:text-xs text-gray-600">
                                        Easy
                                    </p>

                                    <p className="text-[11px] sm:text-xs text-gray-600">
                                        Returns
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Checkout;
