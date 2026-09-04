import React, { useState } from 'react'
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom'
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
        onSuccess:(user)=>{
            dispatch(setUser(user));
            navigate('/');
        }
    });

    const handleSubmit = (e)=>{
        e.preventDefault();
        mutate();
    };
  return (
    <div>
      <h2>LOGIN</h2>
      <form onSubmit={handleSubmit}>
        <input
        type="email" 
        placeholder='Email'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
        />
        <input 
        type="password"
        placeholder='Password'
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        required
        />

        <button disabled={isPending}>{isPending?'Logging in...':'Login'}</button>
        </form>
        {isError && <p style={{color:'red'}}>{error.message}</p>  }

      
    </div>
  )
}

export default Login
