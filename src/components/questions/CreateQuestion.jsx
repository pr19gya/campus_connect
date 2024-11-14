import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';
import isLoggedIn from '../utlis/isLoggedIn';

const CreateQuestion = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: [],
        image: null,
        apiAnswer: ''
    });
    const [loadingAI, setLoadingAI] = useState(false);
    const [message, setMessage] = useState(null);

    const GEMINI_API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY;

    const generateAIAnswer = async () => {
        if (!formData.title || !formData.description) {
            alert('Please fill out the title and description before generating an AI answer.');
            return;
        }
        setLoadingAI(true);
        try {
            const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Generate a concise, helpful answer for the following question:\nTitle: ${formData.title}\nDescription: ${formData.description}`;
            const result = await model.generateContent(prompt);
            const apiAnswer = result.response.text();

            setFormData((prevData) => ({
                ...prevData,
                apiAnswer: apiAnswer
            }));
        } catch (err) {
            console.error("Error generating AI answer:", err);
            setFormData((prevData) => ({
                ...prevData,
                apiAnswer: 'Error generating AI response.'
            }));
        } finally {
            setLoadingAI(false);
        }
    };

    const email = localStorage.getItem('Email');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleTagChange = (e) => {
        const tagsArray = e.target.value.split(',').map(tag => tag.trim());
        setFormData({
            ...formData,
            tags: tagsArray
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevState) => ({
            ...prevState,
            image: file
        }));
    };

    const uploadImageToCloudinary = async (image) => {
        if (!image) return null;

        const imageFormData = new FormData();
        imageFormData.append('file', image);
        imageFormData.append('upload_preset', 'aecxnjdg');

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dqb71iaqi/image/upload',
                imageFormData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Image upload failed:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageUrl = await uploadImageToCloudinary(formData.image);

        const questionData = {
            email,
            title: formData.title,
            description: formData.description,
            tags: formData.tags.length ? formData.tags : null,
            imageUrl: imageUrl || null,
            apiAnswer: formData.apiAnswer
        };

        try {
            const response = await axios.post(`${base_url}question/create`, questionData);
            if (response.status === 201) {
                setMessage("Question created successfully!");
                console.log("Question created successfully:", response.data);
            } else {
                console.error("Failed to create question:", response.data ? response.data.message : "Unknown error");
            }
        } catch (error) {
            console.error("Error submitting question:", error);
        }
    };

    if (!isLoggedIn()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h2 className="text-2xl font-semibold">You need to log in to create a question!</h2>
                <Link to="/Login">
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        LOGIN
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-3xl font-semibold text-gray-700 text-center mb-6">Create a New Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="5"
                />
                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    onChange={handleTagChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none"
                />
                <button
                    type="button"
                    onClick={generateAIAnswer}
                    disabled={loadingAI}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 ${
                        loadingAI && 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    {loadingAI ? 'Generating AI Answer...' : 'Get AI Response'}
                </button>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                >
                    Submit Question
                </button>
            </form>
            {formData.apiAnswer && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">AI Generated Answer:</h3>
                    <p>{formData.apiAnswer}</p>
                </div>
            )}
            {message && (
                <div className="mt-4 text-center text-green-600 font-semibold">
                    {message}
                </div>
            )}
        </div>
    );
};

export default CreateQuestion;
