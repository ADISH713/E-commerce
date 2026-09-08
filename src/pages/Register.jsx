import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/userServices'
import { setUser } from '../redux/slices/authSlice'

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
    <div>
      <h2>REGISTER</h2>
      <form onSubmit={handleSubmit}>
        <input type="text"
        placeholder='Enter your name'
        value={name}
        onChange={(e)=>setName(e.target.value)}
        required
        />
        <input type="email"
        placeholder='Enter your email'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
         />
        <input type="password"
        placeholder='Enter your password'
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        required
         />
         <input type="password"
         placeholder='Confrim password' 
         value={cpassword}
         onChange={(e)=>setCpassword(e.target.value)}
         />
         

    <button disabled={isPending}>{isPending?"Registering":"Register"}</button>
      </form>
      {isError&&<p style={{color:'red'}}>{error.message}</p>}
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
      
    </div>
  )
}

export default Register
