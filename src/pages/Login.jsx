import React, { useState } from 'react'
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom'
import {useMutation} from '@tanstack/react-query'
import { setUser } from '../redux/slices/authSlice';
import {loginUser} from '../services/userServices'


function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const{mutate,isPending,isError,error} = useMutation({
        mutationFn :()=>loginUser(email,password),
        onSuccess:  (user) => {
        dispatch(setUser(user));
        navigate('/', { replace: true});
        }
        });

    const handleSubmit = (e)=>{
        e.preventDefault();
        mutate();
    };
  return (
    <div className='min-h-screen flex items-center justify-start p-8 md:p-16 bg-cover bg-center'
    style={{backgroundImage:"url('/images/LoginBG.png')"}}>
      <div className='w-full max-w-sm bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl'>
      <h1 className='text-2xl font-semi-bold text-white mb-1 tracking-wide'>LOGIN</h1>
      <p className='text-white text-sm mb-6'>Enter your details to continue</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white mb-1">Email</label>
        <input
        type="email" 
        placeholder='Enter your email'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
        className='w-full placeholder-gray-300 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-white'
        />
        </div>
        <div>
        <label className=" block text-xs font-medium text-white mb-1">Password</label>
        <input 
        type="password"
        placeholder='Enter your Password'
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        required
        className='w-full placeholder-gray-300 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-white'
        />
        </div>

        <button disabled={isPending}
        className='w-full bg-orange-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-orange-700 transition disabled:opacity-60'>{isPending?'Logging in...':'Login'}</button>
        </form>
        {isError && <p className='text-red-400 text-xs mt-3'>{error.message}</p>  }
        <p className='text-gray-300 text-xs mt-6 text-center'>
          Don't have an account?
          <Link to='/register' className='text-orange-600 font-medium'>Sign up</Link>
        </p>
        </div>

      
    </div>
  )
}

export default Login
