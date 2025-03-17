import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';
import isLoggedIn from '../utlis/isLoggedIn';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Input } from "@material-tailwind/react";
import { FileUpload } from '../ui/upload';

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
//     const [files, setFiles] = useState([]);
//   const handleFileUpload = (files) => {
//     setFiles(files);
    
//   };
    

    const GEMINI_API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY;

    const generateAIAnswer = async () => {
        if (!formData.title || !formData.description) {
            alert('Please fill out the title and description before generating an AI answer.');
            return;
        }
        setLoadingAI(true);
        try {
            // const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Generate a concise, helpful answer for the following question:\nTitle: ${formData.title}\nDescription: ${formData.description}. Answer in plain text.`;
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
                alert(" question submitted successfully");
            } else {
                console.error("Failed to create question:", response.data ? response.data.message : "Unknown error");
                alert("error in submitting question");
            }
        } catch (error) {
            alert("error in submitting question");
            console.error("Error submitting question:", error);
        }

    };

    if (!isLoggedIn()) {
        return (
            <div className="flex flex-col bg-slate-950 items-center justify-center min-h-screen text-center">
                <h2 className="text-3xl text-slate-300 font-semibold">You need to log in to create a question!</h2>
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
        <div className='bg-slate-950 min-h-screen  '>
        <div className="max-w-4xl mx-auto p-6 bg-transparent  rounded-lg ">
            <h2 className="text-3xl font-semibold pt-10 text-slate-300 text-center mb-10">Create a New Question</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className='m-4 p-[0.1rem] rounded-md  bg-gradient-to-r from-slate-800  to-cyan-500'>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md  focus:outline-none  "
                />
                </div>
                
                <div className='m-4 p-[0.1rem] rounded-md  bg-gradient-to-r from-slate-800  to-cyan-500'>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none "
                    rows="5"
                />
                </div>
                <div className='m-4 p-[0.1rem] rounded-md  bg-gradient-to-r from-slate-800  to-cyan-500'>
                <input
                    type="text"
                    name="tags"
                    placeholder="Tags (comma separated)"
                    onChange={handleTagChange}
                    className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none "
                />
                </div>
                <div className='m-4 p-[0.1rem] rounded-md  bg-gradient-to-r from-slate-800  to-cyan-500'>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none "
                />
                </div>
                 {/* <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-slate-950 border-neutral-200 dark:border-slate-950 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div> */}
                {/* <button
                    type="button"
                    onClick={generateAIAnswer}
                    disabled={loadingAI}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 ${
                        loadingAI && 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    {loadingAI ? 'Generating AI Answer...' : 'Get AI Response'}
                </button> */}
<div className=' flex justify-center items-center'>
                <button className=" overflow-hidden relative w-40 m-4 p-2 h-12 bg-slate-900 text-white border-none rounded-md text-xl font-bold cursor-pointer  z-10 group"
                    type="button"
                    onClick={generateAIAnswer}
                    disabled={loadingAI}>
                    Ask EduBot!
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
                        >Go On!</span>
                </button>

                <button className="overflow-hidden relative w-40 p-2 h-12 bg-slate-900 text-white border-none rounded-md text-xl font-bold cursor-pointer  z-10 group"
                    type="submit">
                    Submit
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
                        >Submit</span>
                </button>
                </div>
                {/* <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                >
                    Submit Question
                </button> */}
            </form>
            {formData.apiAnswer && (
                <div className="mt-6 p-4 bg-slate-950 rounded-lg">
                    <h3 className="text-lg font-semibold pl-2 text-slate-300 mb-2">EduBot says:</h3>
                    <p className='text-slate-300 pl-7'>{formData.apiAnswer}</p>
                </div>
            )}
            {message && (
                <div className="mt-4  text-center text-green-600 font-semibold">
                    {message}
                </div>
            )}
        </div>
        </div>
    );
};

export default CreateQuestion;
