import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base_url } from '../../base_url';
import isLoggedIn from '../utlis/isLoggedIn';

const ThisQuestion = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState([]);
    const [createAns, setCreateAns] = useState('');
    const email = localStorage.getItem('Email');

    useEffect(() => {
        const fetchQuestionDetails = async () => {
            try {
                const response1 = await fetch(`${base_url}question/${id}`);
                const response2 = await fetch(`${base_url}answer/question/${id}`);
                
                if (response1.ok) {
                    const data1 = await response1.json();
                    setQuestion(data1);
                } else {
                    console.log("Unable to fetch question details.");
                }

                if (response2.ok) {
                    const data2 = await response2.json();
                    setAnswer(data2);
                } else {
                    console.log("Unable to fetch answers for this question");
                }
            } catch (error) {
                console.log(error);
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
            const response = await fetch(
                `${base_url}answer/${voteType}/${ansId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to ${voteType}: ${response.status}`);
            }
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(answerData)
            });

            if (response.ok) {
                const createdAnswer = await response.json();
                setAnswer((prevAnswers) => [...prevAnswers, createdAnswer]);
                setCreateAns('');
            } else {
                console.error("Failed to submit answer:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

    const handleVote = (ansId, voteType) => {
        if (!isLoggedIn()) {
            alert("You need to log in to vote");
        } else {
            toggleVotes(ansId, voteType);
        }
    };

    if (!question) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    return (
        <div className='bg-slate-950 min-h-screen'>
        <div className="container bg-slate-950 mx-auto rounded-lg pt-10  max-w-5xl">
            <div className="bg-slate-900 p-6 text-center rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-slate-300 mb-2">{question.title}</h2>
                <p className="text-slate-300 mb-4"><strong></strong> {question.description}</p>
                
                {/* <p className="text-gray-600 mb-4"><strong>Tags:</strong>{question.tags ? {question.tags.join(', ')} : ''}</p> */}
                <p className="text-slate-300 mb-4"><strong>EduBot :</strong> {question.apiAnswer || "Answer not generated yet."}</p>
                <p className="text-cyan-600 mb-2"><strong>Posted By:</strong> {question.postedBy}</p>
                {question.imageUrl && (
                    <div className='flex  justify-center items-center pt-5'>
                        <img src={question.imageUrl} alt="Related" className="w-1/2 h-auto  rounded-md shadow-md" />
                    </div>
                )}
            </div>

            {!isLoggedIn() ? (
                <div className="bg-slate-950 p-4 text-slate-300 rounded-lg shadow-md mb-4 text-center">
                    You need to log in to write an answer!
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
            ) : (
                <form onSubmit={handleAnswerSubmit} className="bg-slate-950 p-4 rounded-lg shadow-md mb-6">
                    <div className='m-4 p-[0.1rem] rounded-md  bg-gradient-to-r from-slate-700  to-cyan-500'>
                    <textarea
                        value={createAns}
                        onChange={handleChange}
                        placeholder="Write your answer here..."
                        required
                        className="w-full text-slate-300 px-4 py-2 bg-slate-950 rounded-md focus:outline-none "
                    />
                    </div>
                    <button className=" overflow-hidden relative w-40 m-4 p-2 h-12 bg-slate-900 text-white border-none rounded-md text-xl font-bold cursor-pointer  z-10 group"
                                          type="submit"
                                          >
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
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M3 10a7 7 0 1114 0A7 7 0 013 10zm7-4a1 1 0 012 0v4h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H8a1 1 0 110-2h2V6z" /></svg>
                                    {ans.upvotedBy.length} Upvotes
                                </button>
                                <button
                                    onClick={() => handleVote(ans._id, 'downvote')}
                                    className="flex items-center text-red-600 hover:text-red-800"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M3 10a7 7 0 1114 0A7 7 0 013 10zm7-4a1 1 0 012 0v4h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H8a1 1 0 110-2h2V6z" /></svg>
                                    {ans.downvotedBy.length} Downvotes
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No Answers yet for this question</p>
                )}
            </div>
        </div>
        </div>
    );
};

export default ThisQuestion;
