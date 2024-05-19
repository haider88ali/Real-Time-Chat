import React, { useState } from 'react'
import Input from '../../commons/Input'
import { useNavigate } from 'react-router-dom'
import Button from '../../commons/Button'
import { useDispatch, useSelector } from "react-redux";
import { AuthLogin } from '../../../redux/slices/AuthSlice'
const Auth = ({isSignInPage = true}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullname: ''
        }),
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        console.log('data :>> ', data);
        e.preventDefault()
        const url= `api/${isSignInPage ? 'login' : 'register'}`;
        const method="post"
        await dispatch(AuthLogin({url,method,data})).then((res)=>{
            console.log(res.payload);
            if(res.status === 400) {
                alert('Invalid credentials')
            }else{
                if(res.payload.token) {
                    localStorage.setItem('user:token', res.payload.token)
                    localStorage.setItem('user:detail', JSON.stringify(res.payload.user))
                    navigate('/')
                }
            }
    });
        // const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })

       
    }

  return (
    <div className='flex flex-col justify-center items-center py-4'>
    <div className='bg-white w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center'>
            <div className=" text-4xl font-extrabold">Welcome </div>
            <div className=" text-xl font-light mb-14"> Sign up to get started</div>
            <form className="flex flex-col items-center w-full" onSubmit={(e) => handleSubmit(e)}>
            { !isSignInPage && <Input label="Full name" name="name" placeholder="Enter your full name" className="mb-6 w-[75%]" value={data.fullname} onChange={(e) => setData({ ...data, fullname: e.target.value }) } />}
            <Input label="Email address" type="email" name="email" placeholder="Enter your email" className="mb-6 w-[75%]" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value }) }/>
            <Input label="Password" type="password" name="password" placeholder="Enter your Password" className="mb-14 w-[75%]" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value }) }/>
            <Button label={isSignInPage ? 'Sign in': 'Sign up'} type='submit' className="w-[75%] mb-2" />
            </form>
            <div>{ isSignInPage ? "Didn't have an account?" : "Alredy have an account?"} <span className=" text-primary cursor-pointer underline" >{ isSignInPage ? 'Sign up' : 'Sign in'}</span></div>
        </div>
        </div>
  )
}

export default Auth