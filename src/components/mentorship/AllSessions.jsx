import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';
import { CardContainer, CardItem } from '../ui/3dcard';
import { CardBody } from '@material-tailwind/react';

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${base_url}mentor/getall-mentor-sessions`);
        if (response.ok) {
          const data = await response.json();
          setSessions(data.data.reverse());
        } else {
          setError("Error fetching sessions data");
        }
      } catch (error) {
        setError("An error occurred while fetching the sessions.");
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const renderSessionStatus = (status) => {
    switch (status) {
      case 'Scheduled':
        return <span className="text-green-500 font-semibold">{status}</span>;
      case 'Completed':
        return <span className="text-gray-500 font-semibold">{status}</span>;
      case 'Cancelled':
        return <span className="text-red-500 font-semibold">{status}</span>;
      default:
        return <span className="text-yellow-500 font-semibold">Unknown</span>;
    }
  };

  const formatDateTime = (datetime) => {
    try {
      const dateObj = new Date(datetime);
      if (isNaN(dateObj)) return 'Invalid Date';
      return dateObj.toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="container mx-auto pt-8 bg-slate-950 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          {error}
        </div>
      ) : sessions.length > 0 ? (
        sessions.map((sess) => {
          const {
            _id,
            title,
            description,
            conductedByName,
            conductedByEmail,
            date,
            meetLink,
            status,
            duration
          } = sess;

          const isPast = new Date(date) < new Date();

          return (
            <CardContainer key={_id} className="inter-var">
              <CardBody className="bg-gray-50 relative group/card mt-8 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-slate-950 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[65rem] h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
                  {title || 'Untitled Session'}
                </CardItem>

                <CardItem translateZ="60" as="p" className="text-neutral-500 text-sm mt-2 dark:text-neutral-300">
                  {description || 'No description available.'}
                </CardItem>

                <div className="mt-5">
                  <CardItem translateZ={20} className="py-2 rounded-xl text-sm font-normal dark:text-cyan-500">
                    <strong>Conducted By:</strong> {conductedByName || 'Unknown'} ({conductedByEmail || 'Not provided'})
                  </CardItem>
                </div>

                <div className="mt-2">
                  <CardItem translateZ={20} className="py-2 rounded-xl text-sm font-normal dark:text-cyan-500">
                    <strong>Scheduled Time:</strong> {formatDateTime(date)}
                  </CardItem>
                </div>

                <div className="mt-2">
                  {isPast ? (
                    <CardItem translateZ={20} className="py-2 rounded-xl text-sm font-normal dark:text-cyan-500">
                      <strong>Status: Completed</strong>
                    </CardItem>
                  ) : (
                    <CardItem translateZ={20} className="py-2 rounded-xl text-sm font-normal dark:text-cyan-500">
                      <strong>Status:</strong> {renderSessionStatus(status)}
                    </CardItem>
                  )}
                </div>

                <div className="mt-2">
                  <CardItem translateZ={20} className="py-2 rounded-xl text-sm font-normal dark:text-cyan-500">
                    <strong>Duration:</strong> {duration ? `${duration} minutes` : 'Not specified'}
                  </CardItem>
                </div>

                <div className='mt-5'>
                  {isPast ? (
                    <button className="px-4 py-2 rounded-xl bg-gray-400 cursor-not-allowed text-white text-xs font-bold" disabled>
                      Session Expired
                    </button>
                  ) : meetLink ? (
                    <Link to={meetLink} target="_blank" rel="noopener noreferrer">
                      <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold">
                        Join Session →
                      </CardItem>
                    </Link>
                  ) : (
                    <div className="text-red-400 text-sm">Meeting link not available</div>
                  )}
                </div>
              </CardBody>
            </CardContainer>
          );
        })
      ) : (
        <div className="text-gray-500 text-lg text-center mt-10">No sessions available at the moment.</div>
      )}
    </div>
  );
};

export default AllSessions;
