import React, { useState, useEffect } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';
import isLoggedIn from '../utlis/isLoggedIn';

const CreateSession = () => {
    const [formData, setFormData] = useState({
        meetLink: '',
        scheduleTime: '10:00 AM',
        status: 'Scheduled', // Default status
        conductedByName: '',
        conductedByEmail: localStorage.getItem('Email') || '',
        date: new Date().toISOString(), // Ensure correct date format
        title: '',
        description: '',
        duration: ''
    });

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch user's name based on email
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const email = localStorage.getItem('Email');
                if (!email) return;

                const response = await fetch(`${base_url}auth/users?email=${email}`);

                if (response.ok) {
                    const userData = await response.json();
                    const userName = `${userData.user.firstName} ${userData.user.lastName}`;
                    setFormData((prevData) => ({
                        ...prevData,
                        conductedByName: userName
                    }));
                } else {
                    console.log("Error fetching user name");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchUserName();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Validate form inputs
    const validateForm = () => {
        const { title, description, meetLink, status, date, duration } = formData;
        if (!title || !description || !meetLink || !status || !date || !duration) {
            setMessage("All fields are required.");
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        // Ensure proper data formatting
        const finalFormData = {
            ...formData,
            duration: Number(formData.duration), // Convert to number
            date: new Date(formData.date).toISOString() // Convert to ISO format
        };

        console.log("Sending Data:", JSON.stringify(finalFormData, null, 2)); // Debugging

        try {
            const response = await fetch(`${base_url}mentor/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalFormData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Session created successfully!");
                console.log("Success Response:", result);
                setFormData({
                    meetLink: '',
                    scheduleTime: '10:00 AM',
                    status: 'Scheduled', // Reset to default
                    conductedByName: formData.conductedByName,
                    conductedByEmail: localStorage.getItem('Email') || '',
                    date: new Date().toISOString(),
                    title: '',
                    description: '',
                    duration: ''
                });
            } else {
                setMessage(`Error: ${result.message || 'Failed to create session'}`);
                console.error("Error Response:", result);
            }
        } catch (error) {
            setMessage("Error creating session.");
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn()) {
        return (
            <div className="flex flex-col bg-slate-950 items-center justify-center min-h-screen text-center">
                <h2 className="text-3xl text-slate-300 font-semibold">You need to log in to create a session!</h2>
                <Link to="/Login">
                <button className=" overflow-hidden relative w-40 m-4 p-2 h-12 bg-slate-900 text-white border-none rounded-md text-xl font-bold cursor-pointer  z-10 group"
                      type="button"
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
                      </button>
                </Link>
            </div>
        );
    }

    return (
        <div className='bg-slate-950'>
            <div className="max-w-3xl mx-auto p-6 bg-slate-950 rounded-lg shadow-md">
                <h2 className="text-3xl text-center text-slate-300 font-semibold mb-6">Create a New Session</h2>

                {message && (
                    <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <InputField label="Title" name="title" value={formData.title} onChange={handleChange} />
                        <InputField label="Description" name="description" value={formData.description} onChange={handleChange} textarea />
                        <InputField label="Meet Link" name="meetLink" value={formData.meetLink} onChange={handleChange} />
                        
                        {/* Status Dropdown */}
                        <div>
                            <label htmlFor="status" className="block text-lg text-slate-400 ml-4 font-medium">Status:</label>
                            <div className='m-4 p-[0.1rem] rounded-md bg-gradient-to-r from-slate-800 to-cyan-500'>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none"
                                    required
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <InputField label="Duration (minutes)" name="duration" value={formData.duration} onChange={handleChange} type="number" />
                        <InputField label="Conducted By" name="conductedByName" value={formData.conductedByName} readOnly />
                    </div>
                    <div className='flex justify-center items-center'>
                    {/* <button type="submit" className="mt-6 w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition" disabled={loading}> */}
                    <button className=" overflow-hidden relative w-40 m-4 p-2 h-12 bg-slate-900 text-white border-none rounded-md text-xl font-bold cursor-pointer  z-10 group"
                    type="submit"
                    >
                    Create Session
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
                        >Create </span>
                </button></div>
                        {loading ? 'Creating Session...' : 'Create Session'}
                    {/* </button> */}
                </form>
            </div>
        </div>
    );
};

// Reusable InputField Component
const InputField = ({ label, name, value, onChange, placeholder, type = "text", textarea, readOnly }) => (
    <div>
        <label htmlFor={name} className="block text-lg text-slate-400 ml-4 font-medium">{label}:</label>
        <div className='m-4 p-[0.1rem] rounded-md bg-gradient-to-r from-slate-800 to-cyan-500'>
            {textarea ? (
                <textarea name={name} value={value} onChange={onChange} className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none" placeholder={placeholder} required />
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none" placeholder={placeholder} readOnly={readOnly} required />
            )}
        </div>
    </div>
);

export default CreateSession;
