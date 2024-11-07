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
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{question.title}</h2>
                <p className="text-gray-700 mb-4"><strong>Description:</strong> {question.description}</p>
                <p className="text-gray-600 mb-2"><strong>Posted By:</strong> {question.postedBy}</p>
                <p className="text-gray-600 mb-4"><strong>Tags:</strong> {question.tags.join(', ')}</p>
                <p className="text-gray-600 mb-4"><strong>Answer:</strong> {question.apiAnswer || "Answer not generated yet."}</p>
                {question.imageUrl && (
                    <img src={question.imageUrl} alt="Related" className="w-1/3 h-auto rounded-md shadow-md" />
                )}
            </div>

            {!isLoggedIn() ? (
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md mb-4 text-center">
                    You need to log in to write an answer!
                    <Link to="/Login">
                        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg">LOGIN</button>
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleAnswerSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                    <textarea
                        value={createAns}
                        onChange={handleChange}
                        placeholder="Write your answer here..."
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Submit Answer
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {answer.length > 0 ? (
                    answer.map((ans) => (
                        <div key={ans._id} className="bg-white p-4 rounded-lg shadow-md">
                            <p className="text-gray-800 mb-2">{ans.answer}</p>
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
    );
};

export default ThisQuestion;
