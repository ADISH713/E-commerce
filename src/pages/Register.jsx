import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/userServices'
import { setUser } from '../redux/slices/authSlice'
import { Link } from 'react-router-dom'

function Register() {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const[cpassword,setCpassword] = useState('')
    const [validationError, setValidationError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {mutate,isPending,isError,error} = useMutation({
        mutationFn :(userData)=>registerUser(userData),
        onSuccess:(user)=>{
            dispatch(setUser(user));
            navigate('/login');
        },
    });

    const handleSubmit = (e) => {
  e.preventDefault();

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    setValidationError('Name cannot be empty');
    return;
  }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    setValidationError('Please enter a valid email address');
    return;
  }

  if (password.length < 6) {
    setValidationError('Password must be at least 6 characters');
    return;
  }

  if (password !== cpassword) {
    setValidationError('Passwords do not match');
    return;
  }

  setValidationError('');
  mutate({ name: trimmedName, email: trimmedEmail, password });
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
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full placeholder-gray-300 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full placeholder-gray-300 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full placeholder-gray-300 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={cpassword}
            onChange={(e) => setCpassword(e.target.value)}
            required
            className="w-full placeholder-gray-300 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-white"
          />
        </div>

        {isError && (
          <p className="text-red-400 text-xs mt-3">
            {error.message}
          </p>
        )}

        {validationError && (
          <p className="text-red-400 text-xs mt-3">
            {validationError}
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
