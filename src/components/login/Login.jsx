import React, { useState } from 'react'
import { base_url } from '../../base_url';
import isLogginIn from '../utlis/isLoggedIn';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email:'',
        password:'',
    });

    const navigate = useNavigate(); 

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };


    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const response = await fetch(`${base_url}auth/login`,{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            });
            if(response.ok){
                const data = await response.json();
                console.log("got the response", data);
                localStorage.setItem("Token" , data.token);
                localStorage.setItem("Email" , data.email);

                if(isLogginIn()){
                    console.log("Token is present");
                    navigate('/');
                }
                
            }
            else{
                console.log("cant register you");
            } 
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}/>
            <input
                type="password"
                name="password"
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}/>
            <button type="submit">Login</button>
        </form>
        <Link>Don't have an account? Register Here!</Link>
    </div>
  )
}

export default Login