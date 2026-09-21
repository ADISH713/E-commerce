import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/userServices'
import { Link } from 'react-router-dom'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useSelector } from 'react-redux';

function Register() {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const[cpassword,setCpassword] = useState('')
    const [errors, setErrors] = useState({name: '',email: '',password: '',cpassword: '',});
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate()
    
    useEffect(() => {
      if (isAuthenticated) {
        navigate('/', { replace: true });
      }
    }, [isAuthenticated, navigate]);


    const {mutate,isPending,isError,error} = useMutation({
        mutationFn :(userData)=>registerUser(userData),
        onSuccess:()=>{;
            navigate('/login',{ replace: true });
        },
    });
    
    const handleSubmit = (e) => {
      e.preventDefault();

      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      const newErrors = {
          name: '',
          email: '',
          password: '',
          cpassword: '',
      };

      if (!trimmedName) {
          newErrors.name = 'Name cannot be empty';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!trimmedEmail) {
          newErrors.email = 'Email is required';
      } else if (!emailRegex.test(trimmedEmail)) {
          newErrors.email = 'Please enter a valid email address';
      }

      if (!password) {
          newErrors.password = 'Password is required';
      } else if (password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
      } else if (/^\d+$/.test(password)) {
          newErrors.password = 'Password cannot contain only numbers';
      }

      if (!cpassword) {
          newErrors.cpassword = 'Please confirm your password';
      } else if (password !== cpassword) {
          newErrors.cpassword = 'Passwords do not match';
      }

      setErrors(newErrors);

      const hasErrors = Object.values(newErrors).some(
          (error) => error !== ''
      );

      if (hasErrors) {
          return;
      }

      mutate({
          name: trimmedName,
          email: trimmedEmail,
          password,
      });
  };

  return (
  <div
    className="min-h-screen flex items-center justify-start p-8 md:p-16 bg-cover bg-center"
    style={{ backgroundImage: "url('/images/LoginBG.png')" }}
  >
    <div className="w-full max-w-sm bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl">

      <h1 className="text-2xl font-semibold text-white mb-1 tracking-wide">
        REGISTER
      </h1>

      <p className="text-white text-sm mb-6">
        Create your account to get started
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({
                    ...prev,
                    name: '',
                }));
            }}
            required
           className={`w-full placeholder-gray-300 bg-white/10 border rounded-md px-3 py-2 text-sm focus:outline-none text-white ${
            errors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-white/20 focus:border-orange-400'}`}
          />

          {errors.name && (
            <p className="text-red-400 text-xs mt-1">
                {errors.name}
            </p>
        )}

        </div>

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
            className={`w-full placeholder-gray-300 bg-white/10 border rounded-md px-3 py-2 text-sm focus:outline-none text-white ${
                errors.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-orange-400'
            }`}
          />
          {errors.email && (
              <p className="text-red-400 text-xs mt-1">
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({
                    ...prev,
                    password: '',
                }));
            }}
            required
            className={`w-full placeholder-gray-300 bg-white/10 border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none text-white ${
                errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-orange-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
          >
            {showPassword ? <IconEye/>:<IconEyeOff/>}
          </button>

        </div>
        {errors.password && (
            <p className="text-red-400 text-xs mt-1">
                {errors.password}
            </p>
        )}
        </div>

        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Confirm Password
          </label>
            <div className='relative'>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={cpassword}
            onChange={(e) => {
                setCpassword(e.target.value);
                setErrors((prev) => ({
                    ...prev,
                    cpassword: '',
                }));
            }}
            required
            className={`w-full placeholder-gray-300 bg-white/10 border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none text-white ${
                errors.cpassword
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-orange-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
          >
            {showConfirmPassword ? <IconEye/> : <IconEyeOff/>}
          </button>
          </div>
          {errors.cpassword && (
            <p className="text-red-400 text-xs mt-1">
                {errors.cpassword}
            </p>
        )}
        </div>

        {isError && (
          <p className="text-red-400 text-xs mt-3">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-orange-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-orange-700 transition disabled:opacity-60"
        >
          {isPending ? "Registering..." : "Register"}
        </button>

      </form>

      <p className="text-gray-300 text-xs mt-6 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-orange-600 font-medium hover:text-orange-500"
        >
          Login
        </Link>
      </p>

    </div>
  </div>
)
}

export default Register
