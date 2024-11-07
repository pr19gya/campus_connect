import React, { useState, useEffect } from 'react';
import { base_url } from '../../base_url';

const CreateSession = () => {
    const [formData, setFormData] = useState({
        meetLink: '',
        scheduleTime: null,
        status: '',
        conductedByName: '',
        conductedByEmail: localStorage.getItem('Email') || '',
        date: '',
        title: '',
        description: '',
        duration: ''
    });

    const [message, setMessage] = useState(null);

    // Fetch user's name and set `conductedByName`
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const email = localStorage.getItem('Email');
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${base_url}mentor/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage("Session created successfully!");
                setFormData({
                    meetLink: '',
                    scheduleTime: '',
                    status: '',
                    conductedByName: formData.conductedByName,
                    conductedByEmail: localStorage.getItem('Email') || '',
                    date: '',
                    title: '',
                    description: '',
                    duration: ''
                });
            } else {
                setMessage("Failed to create session.");
            }
        } catch (error) {
            setMessage("Error creating session.");
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>Create a New Session</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Meet Link:
                    <input
                        type="url"
                        name="meetLink"
                        value={formData.meetLink}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Status:
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        placeholder="e.g., Upcoming, Completed"
                        required
                    />
                </label>
                <label>
                    Conducted By Name:
                    <input
                        type="text"
                        name="conductedByName"
                        value={formData.conductedByName}
                        onChange={handleChange}
                        readOnly
                    />
                </label>
                <label>
                    Conducted By Email:
                    <input
                        type="email"
                        name="conductedByEmail"
                        value={formData.conductedByEmail}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Date:
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Duration (minutes):
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Create Session</button>
            </form>
        </div>
    );
};

export default CreateSession;
