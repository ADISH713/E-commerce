import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { setUser } from '../redux/slices/authSlice';

import { loginUser } from '../services/userServices';

import { IconEye, IconEyeOff } from '@tabler/icons-react';

import { useSelector, useDispatch } from 'react-redux';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // useEffect(() => {
    //   if (isAuthenticated) {
    //     const user = JSON.parse(localStorage.getItem('user'));
    //     if(user?.role === 'admin'){
    //       navigate('/admin',{ replace: true });
    //     }
    //     else{
    //       navigate('/', { replace: true });
    //     }
    //   }
    // }, [isAuthenticated,user, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: () => loginUser(email, password),
        onSuccess: (user) => {
            dispatch(setUser(user));

            if (user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        const newErrors = {
            email: '',
            password: '',
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmedEmail) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(
            (error) => error !== ''
        );

        if (hasErrors) return;

        mutate();
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center sm:justify-start px-4 sm:px-8 md:px-16 py-8 sm:py-10 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/LoginBG.png')" }}
        >
            <div className="w-full max-w-sm bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-5 sm:p-6 md:p-8 shadow-2xl">

                <h1 className="text-xl sm:text-2xl font-semibold text-white mb-1 tracking-wide">
                    LOGIN
                </h1>

                <p className="text-white text-xs sm:text-sm mb-5 sm:mb-6">
                    Enter your details to continue
                </p>

                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">

                    <div>
                        <label className="block text-xs font-medium text-white mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    email: '',
                                }));
                            }}
                            required
                            className={`w-full placeholder-gray-300 bg-white/10 border rounded-md px-3 py-2.5 sm:py-2 text-sm focus:outline-none text-white ${
                                errors.email
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-white/20 focus:border-orange-400'
                            }`}
                        />

                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1 break-words">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white mb-1">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        password: '',
                                    }));
                                }}
                                required
                                className={`w-full placeholder-gray-300 bg-white/10 border rounded-md px-3 py-2.5 sm:py-2 pr-10 text-sm focus:outline-none text-white ${
                                    errors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-white/20 focus:border-orange-400'
                                }`}
                            />

                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1 break-words">
                                    {errors.password}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                            >
                                {showPassword ? <IconEye /> : <IconEyeOff />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={isPending}
                        className="w-full bg-orange-600 text-white text-sm font-medium py-2.5 sm:py-2.5 rounded-md hover:bg-orange-700 transition disabled:opacity-60"
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                {isError && (
                    <p className="text-red-400 text-xs mt-3 break-words">
                        {error.message}
                    </p>
                )}

                <p className="text-gray-300 text-xs mt-5 sm:mt-6 text-center">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-orange-600 font-medium"
                    >
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
