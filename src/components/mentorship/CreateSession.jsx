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
    const [loading, setLoading] = useState(false); // To handle loading state

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

    // Form validation
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
        
        if (!validateForm()) return; // If form is invalid, prevent submission

        setLoading(true); // Show loading spinner

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
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Create a New Session</h2>
            
            {message && (
                <div
                    className={`p-4 mb-6 rounded-lg ${
                        message.includes('success') ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-lg font-medium">Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="meetLink" className="block text-lg font-medium">Meet Link:</label>
                        <input
                            type="url"
                            name="meetLink"
                            value={formData.meetLink}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-lg font-medium">Status:</label>
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            placeholder="e.g., Upcoming, Completed"
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="conductedByName" className="block text-lg font-medium">Conducted By Name:</label>
                        <input
                            type="text"
                            name="conductedByName"
                            value={formData.conductedByName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            readOnly
                        />
                    </div>

                    <div>
                        <label htmlFor="conductedByEmail" className="block text-lg font-medium">Conducted By Email:</label>
                        <input
                            type="email"
                            name="conductedByEmail"
                            value={formData.conductedByEmail}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-lg font-medium">Scheduled Time:</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="duration" className="block text-lg font-medium">Duration (minutes):</label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Creating Session...' : 'Create Session'}
                </button>
            </form>
        </div>
    );
};

export default CreateSession;
