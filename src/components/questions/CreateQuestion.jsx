import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';

const CreateQuestion = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: [],
        image: null  // Only one image
    });

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
        const file = e.target.files[0]; // Allow only one file
        setFormData((prevState) => ({
            ...prevState,
            image: file  // Set the single image file
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
            return response.data.secure_url; // Return only one URL
        } catch (error) {
            console.error("Image upload failed:", error);
            return null;
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const email = localStorage.getItem('Email'); 
        const imageUrl = await uploadImageToCloudinary(formData.image); // Upload image if present
    
        const questionData = {
            email,
            title: formData.title,
            description: formData.description,
            tags: formData.tags,
            imageUrl: imageUrl || null // Ensure imageUrl is a string or null
        };
    
        try {
            const response = await axios.post(`${base_url}question/create`, questionData);
            if (response.data && response.data.success) {
                console.log("Question created successfully:", response.data);
            } else {
                console.error("Failed to create question:", response.data.message);
            }
        } catch (error) {
            console.error("Error submitting question:", error);
        }
    };
    
    if (!email) {
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
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="submit">Submit Question</button>
            </form>
        </div>
    );
};

export default CreateQuestion;
