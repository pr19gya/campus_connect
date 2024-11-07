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
            <div>
                <h2>You need to log in to create a question!</h2>
                <Link to="/Login"><button>LOGIN</button></Link>
            </div>
        );
    }

    return (
        <div>
            <h2>Create a New Question</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    onChange={handleTagChange}
                   
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="button" onClick={generateAIAnswer} disabled={loadingAI}>
                    {loadingAI ? 'Generating AI Answer...' : 'Get AI Response'}
                </button>
                <button type="submit">Submit Question</button>
            </form>
            {formData.apiAnswer && (
                <div>
                    <h3>AI Generated Answer:</h3>
                    <p>{formData.apiAnswer}</p>
                </div>
            )}
        </div>
    );
};

export default CreateQuestion;
