import React, { useState } from 'react';
import { base_url } from '../../base_url';
import isLogginIn from '../utlis/isLoggedIn';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${base_url}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Got the response', data);
                localStorage.setItem('Token', data.token);
                localStorage.setItem('Email', data.email);

                if (isLogginIn()) {
                    console.log('Token is present');
                    navigate('/');
                }
            } else {
                console.log("Can't log you in");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950">
            <div className="bg-slate-950 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-4xl font-bold text-center text-cyan-600 mb-6">LogIn</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='m-4 p-[0.1rem] rounded-md  bg-gradient-to-r from-slate-700  to-cyan-500'>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none "
                        />
                    </div>
                    <div className='m-4 p-[0.1rem] rounded-md  bg-gradient-to-r from-slate-700  to-cyan-500'>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none "
                        />
                    </div>
                    <div className='flex justify-center items-center'>
                    <button className=" overflow-hidden relative w-40  p-2 h-12 bg-slate-900 text-white border-none rounded-md text-xl font-bold cursor-pointer  z-10 group"
                                          type="submit"
                                          >
                                          LogIn
                                          <span
                                              className="absolute w-44 h-32 -top-8 -left-2 bg-cyan-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-bottom"
                                          ></span>
                                          <span
                                              className="absolute w-44 h-32 -top-8 -left-2 bg-cyan-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-bottom"
                                          ></span>
                                          <span
                                              className="absolute w-44 h-32 -top-8 -left-2 bg-cyan-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-bottom"
                                          ></span>
                                          <span
                                              className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-12  z-10"
                                              >LogIn</span>
                                          </button></div>
                    
                </form>
                <div className="mt-4 text-center">
                    <Link
                        to="/Register"
                        className="text-cyan-600 hover:text-cyan-700 font-medium transition duration-300"
                    >
                        Dont have an account? Register Here!
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
