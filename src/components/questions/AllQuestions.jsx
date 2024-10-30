import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';

const AllQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${base_url}question/getall`);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                    setFilteredQuestions(data);

                    const tags = new Set();
                    data.forEach(question => {
                        question.tags.forEach(tag => tags.add(tag));
                    });
                    setUniqueTags(Array.from(tags));
                } else {
                    console.log("Unable to fetch data, some error occurred");
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchQuestions();
    }, []);

    const handleTagClick = (tag) => {
        setSelectedTag(prevTag => {
            if (prevTag.includes(tag)) {
                return prevTag.filter(selectedTag => selectedTag !== tag);
            } else {
                return [...prevTag, tag];
            }
        });
    };

    useEffect(() => {
        if (selectedTag.length > 0) {
            setFilteredQuestions(
                questions.filter(question =>
                    question.tags.some(tag => selectedTag.includes(tag))
                )
            );
        } else {
            setFilteredQuestions(questions);
        }
    }, [selectedTag, questions]);

    return (
        <div>
            <h2>Questions List</h2>
            <Link to="/Create">
                <button>CREATE A QUESTION</button>
            </Link>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setSelectedTag([])} style={{ margin: '5px' }}>
                    All
                </button>
                {uniqueTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        style={{
                            margin: '5px',
                            backgroundColor: selectedTag.includes(tag) ? '#007bff' : '#e0e0e0',
                            color: selectedTag.includes(tag) ? '#fff' : '#000'
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                    <div key={question._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                        <h3>{question.title}</h3>
                        <p><strong>Description:</strong> {question.description}</p>
                        <p><strong>Posted By:</strong> {question.postedBy}</p>
                        <p><strong>Tags:</strong> {question.tags.join(', ')}</p>
                        <p><strong>Answer:</strong> {question.apiAnswer}</p>
                        <p><strong>Created At:</strong> {new Date(question.createdAt).toLocaleString()}</p>
                        
                        {question.imageUrl && (
                            <div>
                                <strong>Image:</strong>
                                <img
                                    src={question.imageUrl}
                                    alt="Question related"
                                    style={{ maxWidth: '10%', height: 'auto', marginTop: '10px' }}
                                />
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No questions available.</p>
            )}
        </div>
    );
};

export default AllQuestions;
