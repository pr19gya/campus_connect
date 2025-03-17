import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';
import { CardContainer, CardItem } from '../ui/3dcard';
import { CardBody } from '@material-tailwind/react';

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${base_url}mentor/getall-mentor-sessions`);
        
        if (response.ok) {
          const data = await response.json();
          setSessions(data.data.reverse()); // Access 'data' array directly
        } else {
          setError("Error fetching sessions data");
        }
      } catch (error) {
        setError("An error occurred while fetching the sessions.");
        console.log("Fetch error:", error);
      } finally {
        setLoading(false); // Stop loading when done
      }
    };
    
    fetchSessions();
  }, []);

  const renderSessionStatus = (status) => {
    switch (status) {
      case 'Upcoming':
        return <span className="text-green-500 font-semibold">{status}</span>;
      case 'Completed':
        return <span className="text-gray-500 font-semibold">{status}</span>;
      case 'Cancelled':
        return <span className="text-red-500 font-semibold">{status}</span>;
      default:
        return <span className="text-black font-semibold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="spinner"></div> {/* You can use a spinner component here */}
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 bg-slate-950 min-h-screen">
      {/* Error Handling */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* Session Listings */}
      {sessions.length > 0 ? (
        sessions.map((sess) => (
          
            <CardContainer key={sess._id}  className="inter-var ">
                                            <CardBody className="bg-gray-50 relative group/card mt-8 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-slate-950 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[65rem] h-auto rounded-xl p-6 border  ">
                                                       
                                                <CardItem
                                                translateZ="50"
                                                className="text-xl font-bold text-neutral-600 dark:text-white"
                                                >
                                                {sess.title}
                                                </CardItem>
                                                <CardItem
                                                as="p"
                                                translateZ="60"
                                                className="text-neutral-500 text-sm  mt-2 dark:text-neutral-300"
                                                >
                                                {sess.description}
                                                </CardItem>
                                                
                                                <div className=" mt-5">
                                                <CardItem
                                                    translateZ={20}
                                                    as={Link}
                                                    href="https://twitter.com/mannupaaji"
                                                    target="__blank"
                                                    className=" py-2 rounded-xl text-sm font-normal dark:text-cyan-500"
                                                >
                                                   <b> <strong>Conducted By:</strong> {sess.conductedByName} ({sess.conductedByEmail})</b>
                                                </CardItem>
                                                
                                                </div>
                                                <div className=" mt-2">
                                                <CardItem
                                                    translateZ={20}
                                                    as={Link}
                                                    href="https://twitter.com/mannupaaji"
                                                    target="__blank"
                                                    className=" py-2 rounded-xl text-sm font-normal dark:text-cyan-500"
                                                >
                                                   <b> <strong>Scheduled Time:</strong> {new Date(sess.scheduleTime).toLocaleString()}</b>
                                                </CardItem>
                                                
                                                </div>
                                                <div className=" mt-2">
                                                <CardItem
                                                    translateZ={20}
                                                    as={Link}
                                                    href="https://twitter.com/mannupaaji"
                                                    target="__blank"
                                                    className=" py-2 rounded-xl text-sm font-normal dark:text-cyan-500"
                                                >
                                                   <b><strong>Status:</strong> {renderSessionStatus(sess.status)}</b>
                                                </CardItem>
                                                
                                                </div>
                                                <div className=" mt-2">
                                                <CardItem
                                                    translateZ={20}
                                                    as={Link}
                                                    href="https://twitter.com/mannupaaji"
                                                    target="__blank"
                                                    className=" py-2 rounded-xl text-sm font-normal dark:text-cyan-500"
                                                >
                                                   <b><strong>Duration:</strong> {sess.duration} minutes</b>
                                                </CardItem>
                                                
                                                </div>
                                                <Link to={sess.meetLink} target="_blank" rel="noopener noreferrer">
                                                <div className='mt-5'>
                                                <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Join Session →
          </CardItem></div></Link>
                                            </CardBody>
                                        </CardContainer>
            
          
        ))
      ) : (
        <div className="text-gray-500 text-lg">No sessions available at the moment.</div>
      )}
    </div>
  );
};

export default AllSessions;
