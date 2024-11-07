import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';

const AllQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [displayedTags, setDisplayedTags] = useState([]); 
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [tagsToShow, setTagsToShow] = useState(5);

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
                        if (question.tags && question.tags.length > 0) {
                            question.tags.forEach(tag => tags.add(tag));
                        }
                    });
                    const allTags = Array.from(tags);
                    setUniqueTags(allTags);
                    setDisplayedTags(allTags.slice(0, tagsToShow));
                } else {
                    console.log("Unable to fetch data, some error occurred");
                }
            } catch (error) {
                console.log("Error fetching questions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) => {
            if (prevTags.includes(tag)) {
                return prevTags.filter((selectedTag) => selectedTag !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    };

    const handleClearTags = () => {
        setSelectedTags([]);
    };

    const handleShowMoreTags = () => {
        setTagsToShow((prev) => prev + 5); 
    };

    useEffect(() => {
        if (selectedTags.length > 0) {
            setFilteredQuestions(
                questions.filter(question =>
                    question.tags && question.tags.some(tag => selectedTags.includes(tag))
                )
            );
        } else {
            setFilteredQuestions(questions);
        }
    }, [selectedTags, questions]);

    useEffect(() => {
        const filteredTags = uniqueTags.filter(tag =>
            tag.toLowerCase().includes(tagSearch.toLowerCase())
        );
        setDisplayedTags(filteredTags.slice(0, tagsToShow));
    }, [tagSearch, tagsToShow, uniqueTags]);

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Tag Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                {displayedTags.filter(tag=>tag!=="").map(tag => (
                    <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-4 py-1 rounded-3xl font-semibold border transition ${
                            selectedTags.includes(tag)
                                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300'
                        }`}
                    >
                        {tag}
                    </button>
                ))}

                {/* Show More Tags Button */}
                {displayedTags.length < uniqueTags.length && (
                    <button
                        onClick={handleShowMoreTags}
                        className="px-4 py-1 rounded-3xl font-semibold border bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
                    >
                        Show More Tags
                    </button>
                )}
            </div>

            {/* Clear Filter Button */}
            {selectedTags.length > 0 && (
                <button
                    onClick={handleClearTags}
                    className="px-4 py-2 mb-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
                >
                    Clear Filter
                </button>
            )}

            {/* Question Count Display */}
            <p className="text-gray-600 mb-4">{filteredQuestions.length} questions found</p>

            {/* Loading Spinner */}
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
            ) : filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                    <Link
                        to={`/question/${question.questionId}`}
                        key={question.questionId || Math.random()}
                        className="block text-gray-900 hover:no-underline"
                    >
                        <div className="border border-gray-300 rounded-lg p-6 mb-4 shadow-lg hover:shadow-xl transition">
                            
                            {/* Display Tags at the Top */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {question.tags && question.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <h3 className="text-xl font-semibold mb-2">{question.title}</h3>
                            <p className="text-gray-700 mb-2">
                                {question.description}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Posted By:</strong> {question.postedBy}
                            </p>

                            {question.imageUrl && (
                                <div className="mt-4">
                                    <img
                                        src={question.imageUrl}
                                        alt="Question related"
                                        className="max-w-full h-48 object-cover rounded-md shadow-md hover:shadow-lg transition"
                                    />
                                </div>
                            )}
                        </div>
                    </Link>
                ))
            ) : (
                <p className="text-gray-600 text-center mt-8">No questions available.</p>
            )}
        </div>
    );
};

export default AllQuestions;
