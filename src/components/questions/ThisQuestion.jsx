import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base_url } from '../../base_url';

const ThisQuestion = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState([]);
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
            console.log(ansId);
            if (!response.ok) {
                throw new Error(`Failed to ${voteType}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error updating ${voteType}:`, error);
        }
    };
    

    if (!question) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{question.title}</h2>
            <p><strong>Description:</strong> {question.description}</p>
            <p><strong>Posted By:</strong> {question.postedBy}</p>
            <p><strong>Tags:</strong> {question.tags.join(', ')}</p>
            <p><strong>Answer:</strong> {question.apiAnswer || "Answer not generated yet."}</p>
            {question.imageUrl && (
                <div>
                    <img src={question.imageUrl} alt="Related" style={{ maxWidth: '20%', height: 'auto' }} />
                </div>
            )}
            {!email && (
                <div>
                    You need to log in to write an answer! <Link to="/Login"><button>LOGIN</button></Link>
                </div>
            )}
            {answer.length > 0 ? (
                answer.map((ans) => (
                    <div key={ans._id}>
                        <div>{ans.answer}</div>
                        <button onClick={() => toggleVotes(ans._id, 'upvote')}>
                            Upvotes: {ans.upvotedBy.length}
                        </button>
                        <button onClick={() => toggleVotes(ans._id, 'downvote')}>
                            Downvotes: {ans.downvotedBy.length}
                        </button>
                        <br /><br />
                    </div>
                ))
            ) : (
                <p>No Answers yet for this question</p>
            )}
        </div>
    );
};

export default ThisQuestion;