import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {IconArrowLeft,IconLock,IconMail,IconUser,IconPhone,IconHome,IconMapPin,IconMap,IconShieldCheck,
    IconTruck,IconRefresh} from '@tabler/icons-react';
import { formatPrice } from '../utils/formatPrice';
import {IconCreditCard,IconWallet,IconCash} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../services/orderServices';
import { clearCartState } from '../redux/slices/cartSlice';
import { updateCart } from '../services/cartServices';
import toast from 'react-hot-toast';

function Checkout() {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const { items,cartId } = useSelector((state) => state.cart);
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
        const orderData = {
            userId: user.id,
            items: items,
            shippingAddress: formData,
            paymentMethod: paymentMethod,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            status: "placed",
            createdAt: new Date().toISOString(),
        };

        await createOrder(orderData);

        if (cartId){
            await updateCart(cartId,[]);
        }
        dispatch(clearCartState());

        toast.success("Order placed successfully!");
    } catch (error) {
        console.error("Failed to place order:", error);
        toast.error("Failed to place order. Please try again.");
    }
};

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-medium text-gray-900 mb-2">
                        Your cart is empty
                    </h1>

                    <p className="text-sm text-gray-500 mb-6">
                        Add some RC cars before proceeding to checkout.
                    </p>

                    <Link
                        to="/products"
                        className="inline-block bg-orange-600 text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-orange-700 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">


            {/* Main */}

            <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

                {/* Back to cart */}

                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 mb-8"
                >
                    <IconArrowLeft size={16} />
                    Back to Cart
                </Link>


                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12">


                    {/* LEFT SIDE */}

                    <div>

                        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                            Checkout
                        </h1>


                        {/* Steps */}

                        <div className="flex items-center gap-4 mb-10">

                             {/* Shipping */}

                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step >= 1
                                            ? 'bg-orange-600 text-white'
                                            : 'border border-gray-300 text-gray-500'
                                    }`}
                                >
                                    1
                                </span>

                                <span
                                    className={`text-sm ${
                                        step >= 1
                                            ? 'font-medium text-orange-600'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    Shipping
                                </span>
                            </div>


                            <div className="h-px w-12 bg-gray-200"></div>


                            {/* Payment */}

                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step >= 2
                                            ? 'bg-orange-600 text-white'
                                            : 'border border-gray-300 text-gray-500'
                                    }`}
                                >
                                    2
                                </span>

                                <span
                                    className={`text-sm ${
                                        step >= 2
                                            ? 'font-medium text-orange-600'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    Payment
                                </span>
                            </div>


    <div className="h-px w-12 bg-gray-200"></div>


    {/* Review */}

    <div className="flex items-center gap-2">
        <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3
                    ? 'bg-orange-600 text-white'
                    : 'border border-gray-300 text-gray-500'
            }`}
        >
            3
        </span>

        <span
            className={`text-sm ${
                step >= 3
                    ? 'font-medium text-orange-600'
                    : 'text-gray-400'
            }`}
        >
            Review
        </span>
    </div>

                            
                        </div>

                    {step === 1 && (
                        <form onSubmit={handleShippingSubmit}>

                            {/* Contact Information */}

                            <section className="mb-8">

                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Contact Information
                                </h2>

                                <div className="relative">

                                    <IconMail
                                        size={18}
                                        className="absolute left-4 top-5 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email address"
                                        required
                                        className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-4 text-sm outline-none focus:border-orange-500 transition"
                                    />

                                </div>

                            </section>


                            {/* Shipping Address */}

                            <section>

                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Shipping Address
                                </h2>
                                
                                <div className="space-y-4">

                                    {/* Full Name */}

                                    <div className="relative">

                                        <IconUser
                                            size={18}
                                            className="absolute left-4 top-5 text-gray-400"
                                        />

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            required
                                            className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-4 text-sm outline-none focus:border-orange-500 transition"
                                        />

                                    </div>


                                    {/* Phone */}

                                    <div className="relative">

                                        <IconPhone
                                            size={18}
                                            className="absolute left-4 top-5 text-gray-400"
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            required
                                            className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-4 text-sm outline-none focus:border-orange-500 transition"
                                        />

                                    </div>


                                    {/* Address 1 */}

                                    <div className="relative">

                                        <IconHome
                                            size={18}
                                            className="absolute left-4 top-5 text-gray-400"
                                        />

                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={formData.addressLine1}
                                            onChange={handleChange}
                                            placeholder="Address Line 1"
                                            required
                                            className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-4 text-sm outline-none focus:border-orange-500 transition"
                                        />

                                    </div>


                                    {/* Address 2 */}

                                    <div className="relative">

                                        <IconHome
                                            size={18}
                                            className="absolute left-4 top-5 text-gray-400"
                                        />

                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={formData.addressLine2}
                                            onChange={handleChange}
                                            placeholder="Address Line 2 (Optional)"
                                            className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-4 text-sm outline-none focus:border-orange-500 transition"
                                        />

                                    </div>


                                    {/* City + State */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        <div className="relative">

                                            <IconMapPin
                                                size={18}
                                                className="absolute left-4 top-5 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="City"
                                                required
                                                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-4 text-sm outline-none focus:border-orange-500 transition"
                                            />

                                        </div>


                                        <div className="relative">

                                            <IconMap
                                                size={18}
                                                className="absolute left-4 top-5 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                placeholder="State"
                                                required
                                                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-4 text-sm outline-none focus:border-orange-500 transition"
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
                                        className="w-full border border-gray-200 rounded-lg px-4 py-4 text-sm outline-none focus:border-orange-500 transition"
                                    />

                                </div>

                            </section>

                            {/* Continue */}

                            <button
                                type="submit"
                                className="w-full mt-8 bg-orange-600 text-white font-medium py-3.5 rounded-lg hover:bg-orange-700 transition"
                            >
                                Continue to Payment
                            </button>

                        </form>
                    )}
                    {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
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
                                    className={`w-full flex items-center gap-4 border rounded-lg p-4 text-left ${
                                        paymentMethod === 'cod'
                                            ? 'border-orange-600 bg-orange-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <IconCash size={24} />
                                    <div>
                                        <p className="font-medium">Cash on Delivery</p>
                                        <p className="text-sm text-gray-500">
                                            Pay when your order arrives
                                        </p>
                                    </div>
                                </button>

                                {/* UPI */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`w-full flex items-center gap-4 border rounded-lg p-4 text-left ${
                                        paymentMethod === 'upi'
                                            ? 'border-orange-600 bg-orange-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <IconWallet size={24} />
                                    <div>
                                        <p className="font-medium">UPI</p>
                                        <p className="text-sm text-gray-500">
                                            Pay using UPI
                                        </p>
                                    </div>
                                </button>

                                {/* Card */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`w-full flex items-center gap-4 border rounded-lg p-4 text-left ${
                                        paymentMethod === 'card'
                                            ? 'border-orange-600 bg-orange-50'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <IconCreditCard size={24} />
                                    <div>
                                        <p className="font-medium">Credit / Debit Card</p>
                                        <p className="text-sm text-gray-500">
                                            Pay securely using your card
                                        </p>
                                    </div>
                                </button>

                                {/* Card fields */}
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Card Number"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3"
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="MM / YY"
                                                className="border border-gray-300 rounded-md px-4 py-3"
                                            />

                                            <input
                                                type="text"
                                                placeholder="CVV"
                                                className="border border-gray-300 rounded-md px-4 py-3"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-5 py-3 border border-gray-300 rounded-md"
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
                                        className="flex-1 bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700"
                                    >
                                        Continue to Review
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-8">

                                {/* Review Header */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Review Your Order
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Check your details before placing the order.
                                    </p>
                                </div>


                                {/* Shipping Information */}
                                <section className="border border-gray-200 rounded-lg p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium text-gray-900">
                                            Shipping Information
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-sm text-orange-600 hover:text-orange-700"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="space-y-1 text-sm text-gray-600">
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
                                <section className="border border-gray-200 rounded-lg p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-medium text-gray-900">
                                            Payment Method
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="text-sm text-orange-600 hover:text-orange-700"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        {paymentMethod === 'cod' && (
                                            <>
                                                <IconCash size={20} />
                                                <span>Cash on Delivery</span>
                                            </>
                                        )}

                                        {paymentMethod === 'upi' && (
                                            <>
                                                <IconWallet size={20} />
                                                <span>UPI</span>
                                            </>
                                        )}

                                        {paymentMethod === 'card' && (
                                            <>
                                                <IconCreditCard size={20} />
                                                <span>Credit / Debit Card</span>
                                            </>
                                        )}
                                    </div>
                                </section>


                                {/* Items */}
                                <section className="border border-gray-200 rounded-lg p-5">
                                    <h3 className="font-medium text-gray-900 mb-4">
                                        Order Items
                                    </h3>

                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>

                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>


                                {/* Place Order */}
                                <div className="flex gap-3 pt-2">

                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="px-5 py-3 border border-gray-300 rounded-md"
                                    >
                                        Back to Payment
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handlePlaceOrder}
                                        className="flex-1 bg-orange-600 text-white font-medium py-3 rounded-md hover:bg-orange-700 transition"
                                    >
                                        Place Order
                                    </button>

                                </div>

                            </div>
                        )}
                    </div>


                    {/* RIGHT SIDE */}

                    <div>

                        <div className="border border-gray-200 rounded-xl p-6 lg:sticky lg:top-6">

                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Order Summary
                            </h2>


                            {/* Cart Items */}

                            <div className="space-y-5">

                                {items.map((item) => (

                                    <div
                                        key={item.id}
                                        className="flex gap-4"
                                    >

                                        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">

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


                                        <div className="flex-1">

                                            <h3 className="text-sm font-medium text-gray-900">
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


                            <div className="border-t border-gray-200 mt-6 pt-5">

                                <div className="flex justify-between text-sm mb-4">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-gray-900">
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


                                <div className="border-t border-gray-200 pt-5 flex justify-between">

                                    <span className="font-semibold text-gray-900">
                                        Total
                                    </span>

                                    <span className="text-xl font-semibold text-orange-600">
                                        {formatPrice(total)}
                                    </span>

                                </div>

                            </div>


                            {/* Trust badges */}

                            <div className="grid grid-cols-3 gap-3 mt-7 pt-6 border-t border-gray-100">

                                <div className="text-center">

                                    <IconShieldCheck
                                        size={24}
                                        className="mx-auto text-orange-600 mb-2"
                                    />

                                    <p className="text-xs text-gray-600">
                                        Secure
                                    </p>

                                    <p className="text-xs text-gray-600">
                                        Checkout
                                    </p>

                                </div>


                                <div className="text-center">

                                    <IconTruck
                                        size={24}
                                        className="mx-auto text-orange-600 mb-2"
                                    />

                                    <p className="text-xs text-gray-600">
                                        Free
                                    </p>

                                    <p className="text-xs text-gray-600">
                                        Shipping
                                    </p>

                                </div>


                                <div className="text-center">

                                    <IconRefresh
                                        size={24}
                                        className="mx-auto text-orange-600 mb-2"
                                    />

                                    <p className="text-xs text-gray-600">
                                        Easy
                                    </p>

                                    <p className="text-xs text-gray-600">
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