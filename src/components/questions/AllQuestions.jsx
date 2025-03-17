import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';
import { HoverBorderGradient } from '../ui/tags';
import { CardContainer, CardItem } from '../ui/3dcard';
import { CardBody } from '@material-tailwind/react';


 

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
                    setQuestions(data.reverse());
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
    }, );

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
        <div className='bg-slate-950 min-h-screen'>
            <div className=" container mx-auto p-4 max-w-5xl">
            
                
                <div className="flex flex-wrap gap-2 my-6">

                    {displayedTags.filter(tag=>tag!=="").map(tag => (
                       
                        <div key={tag}
                             onClick={() => handleTagClick(tag)} className=" flex justify-center text-center">
                        <HoverBorderGradient
                          containerClassName="rounded-full"
                          as="button"
                          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                        >
                          
                          <span>{tag}</span>
                        </HoverBorderGradient>
                      </div>
                  
                        
                    ))}

                    {displayedTags.length < uniqueTags.length && (
                        <button
                            onClick={handleShowMoreTags}
                            className="px-4 py-1 rounded-3xl font-semibold border bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
                        >
                        Show More
                        </button>
                    )}

                </div>

                


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
                            <CardContainer className="inter-var ">
                                <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-slate-950 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[65rem] h-auto rounded-xl p-6 border  ">
                                           <div className='mb-2'>
                                            {
                                            question.tags && question.tags.map((tag, index) => (
                                            <span  key={index} className="text-xs font-medium text-cyan-500 uppercase dark:text-cyan-500">   {tag} </span>
                                            ))}
                                            </div>
                                    <CardItem
                                    translateZ="50"
                                    className="text-xl font-bold text-neutral-600 dark:text-white"
                                    >
                                    {question.title}
                                    </CardItem>
                                    <CardItem
                                    as="p"
                                    translateZ="60"
                                    className="text-neutral-500 text-sm  mt-2 dark:text-neutral-300"
                                    >
                                    {question.description}
                                    </CardItem>
                                    {question.imageUrl && (
                                    <CardItem translateZ="100" className="w-full mt-4">
                                    <img
                                        src={question.imageUrl}
                                        height="1000"
                                        width="1000"
                                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                        alt="thumbnail"
                                    />
                                    </CardItem>
                                     )}
                                    <div className="flex justify-between items-center mt-20">
                                    <CardItem
                                        translateZ={20}
                                        as={Link}
                                        href="https://twitter.com/mannupaaji"
                                        target="__blank"
                                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-cyan-500"
                                    >
                                       <b> Posted by : {question.postedBy}</b>
                                    </CardItem>
                                    
                                    </div>
                                </CardBody>
                            </CardContainer>
                            <div className=" py-6 mb-4 shadow-lg hover:shadow-xl transition">
                                
                               
                            </div>   
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-600 text-center mt-8">No questions available.</p>
                )}  
            </div>
        </div>
    );
};

export default AllQuestions;
