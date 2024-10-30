import React, { useState } from 'react'
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';
import Login from '../../app/login/Login';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName:'',
        lastName:'',
        contactNumber:'',
        year:'',
        email:'',
        password:'',
        rating:''
    });

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
            const response = await fetch(`${base_url}auth/register`,{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            });
            if(response.ok){
                const data = await response.json();
                console.log("got the response", data);
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
                type="text"
                name="firstName"
                placeholder='Firstname'
                value={formData.firstName}
                onChange={handleChange}/>
            <input
                type="text"
                name="lastName"
                placeholder='Lastname'
                value={formData.lastName}
                onChange={handleChange}/>
            <input
                type="text"
                name="contactNumber"
                placeholder='Contact Number'
                value={formData.contactNumber}
                onChange={handleChange}/>
            <input 
                type="number"
                name="year"
                placeholder='Year'
                value={formData.year}
                onChange={handleChange}/>
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
            <input
                type="number"
                name="rating"
                placeholder='Rating'
                value={formData.rating}
                onChange={handleChange}/>
            <button type="submit">Register</button>
        </form>
        <Link to="/Login">Already Registered? Login Here</Link>
    </div>
  )
}

export default Register