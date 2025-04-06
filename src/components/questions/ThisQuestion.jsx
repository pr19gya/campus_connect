import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base_url } from '../../base_url';
import isLoggedIn from '../utlis/isLoggedIn';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ThisQuestion = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState([]);
    const [createAns, setCreateAns] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [apiAnswer, setApiAnswer] = useState('');
    const [loadingPage, setLoadingPage] = useState(true);
    const email = localStorage.getItem('Email');
    const navigate = useNavigate();

    const GEMINI_API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY;

    useEffect(() => {
        const fetchQuestionDetails = async () => {
            try {
                const response1 = await fetch(`${base_url}question/${id}`);
                const response2 = await fetch(`${base_url}answer/question/${id}`);

                if (response1.ok) {
                    const data1 = await response1.json();
                    setQuestion(data1);
                    setApiAnswer(data1.apiAnswer || '');
                }

                if (response2.ok) {
                    const data2 = await response2.json();
                    setAnswer(data2);
                }
            } catch (error) {
                console.error('Error fetching question data:', error);
            } finally {
                setLoadingPage(false);
            }
        };

        fetchQuestionDetails();
    }, [id]);

    const toggleVotes = async (ansId, voteType) => {
        const selectedAns = answer.find(ans => ans._id === ansId);
        if (!selectedAns) return;

        const isUpvoted = selectedAns.upvotedBy.includes(email);
        const isDownvoted = selectedAns.downvotedBy.includes(email);

        let updatedUpvotes = [...selectedAns.upvotedBy];
        let updatedDownvotes = [...selectedAns.downvotedBy];

        if (voteType === 'upvote') {
            if (isUpvoted) {
                updatedUpvotes = updatedUpvotes.filter(user => user !== email);
            } else {
                updatedUpvotes.push(email);
                updatedDownvotes = updatedDownvotes.filter(user => user !== email);
            }
        } else if (voteType === 'downvote') {
            if (isDownvoted) {
                updatedDownvotes = updatedDownvotes.filter(user => user !== email);
            } else {
                updatedDownvotes.push(email);
                updatedUpvotes = updatedUpvotes.filter(user => user !== email);
            }
        }

        setAnswer(prevAnswers =>
            prevAnswers.map(ans =>
                ans._id === ansId
                    ? { ...ans, upvotedBy: updatedUpvotes, downvotedBy: updatedDownvotes }
                    : ans
            )
        );

        try {
            await fetch(`${base_url}answer/${voteType}/${ansId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
        } catch (error) {
            console.error(`Error updating ${voteType}:`, error);
        }
    };

    const handleChange = (e) => {
        setCreateAns(e.target.value);
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!createAns) return;

        const answerData = {
            questionId: id,
            answer: createAns,
            userEmail: email
        };

        try {
            const response = await fetch(`${base_url}answer/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answerData)
            });

            if (response.ok) {
                const createdAnswer = await response.json();
                setAnswer(prev => [...prev, createdAnswer]);
                setCreateAns('');
            } else {
                console.error('Failed to submit answer:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleVote = (ansId, voteType) => {
        if (!isLoggedIn()) {
            alert('You need to log in to vote');
        } else {
            toggleVotes(ansId, voteType);
        }
    };

    const generateAIAnswer = async () => {
        setLoadingAI(true);
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `Generate a helpful answer for the following question:\nTitle: ${question.title}\nDescription: ${question.description}. Answer in plain text.`;
            const result = await model.generateContent(prompt);
            const generated = result.response.text();

            setApiAnswer(generated);

            await fetch(`${base_url}question/api-answer`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId: id,
                    apiAnswer: generated
                }),
            });
        } catch (err) {
            console.error('Error generating AI answer:', err);
            setApiAnswer('Error generating AI response.');
        } finally {
            setLoadingAI(false);
        }
    };

    if (loadingPage) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-950">
                <div className="text-cyan-400 text-xl font-semibold animate-pulse">
                    Loading question...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 min-h-screen">
            <div className="container bg-slate-950 mx-auto rounded-lg pt-10 max-w-5xl">
                <div className="bg-slate-900 p-6 text-center rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold text-slate-300 mb-2">{question.title}</h2>
                    <p className="text-slate-300 mb-4">{question.description}</p>

                    <p className="text-slate-300 mb-4">
                        <strong>EduBot:</strong>
                        <div className="mt-2">
                            {loadingAI ? (
                                <div className="text-cyan-400">Generating AI answer...</div>
                            ) : apiAnswer ? (
                                <div className="whitespace-pre-line bg-slate-800 p-4 rounded-md border border-cyan-600 mt-2">
                                    {apiAnswer}
                                </div>
                            ) : (
                                <button
                                    onClick={generateAIAnswer}
                                    className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Generate AI Answer
                                </button>
                            )}
                        </div>
                    </p>
                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/profile/${question.postedBy}`);
                                        }}
                                        className="flex justify-center items-center  cursor-pointer"
                                    ><p className="text-cyan-600 mb-2"><strong>Posted By:</strong> {question.name}</p></div>
                    
                    {question.imageUrl && (
                        <div className="flex justify-center items-center pt-5">
                            <img src={question.imageUrl} alt="Related" className="w-1/2 h-auto rounded-md shadow-md" />
                        </div>
                    )}
                </div>

                {!isLoggedIn() ? (
                    <div className="bg-slate-950 p-4 text-slate-300 rounded-lg shadow-md mb-4 text-center">
                        You need to log in to write an answer!
                        <Link to="/Login">
                            <button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
                                Log In
                            </button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleAnswerSubmit} className="bg-slate-950 p-4 rounded-lg shadow-md mb-6">
                        <textarea
                            value={createAns}
                            onChange={handleChange}
                            placeholder="Write your answer here..."
                            required
                            className="w-full text-slate-300 px-4 py-2 bg-slate-900 rounded-md focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    </form>
                )}

                <div className="space-y-4 pb-10">
                    {answer.length > 0 ? (
                        answer.map((ans) => (
                            <div key={ans._id} className="bg-slate-900 p-4 rounded-lg shadow-md">
                                <p className="text-slate-300 mb-2">{ans.answer}</p>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleVote(ans._id, 'upvote')}
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        👍 {ans.upvotedBy.length}
                                    </button>
                                    <button
                                        onClick={() => handleVote(ans._id, 'downvote')}
                                        className="flex items-center text-red-600 hover:text-red-800"
                                    >
                                        👎 {ans.downvotedBy.length}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No answers yet for this question</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThisQuestion;
