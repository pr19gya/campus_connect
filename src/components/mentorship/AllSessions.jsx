import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';

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
          setSessions(data.data); // Access 'data' array directly
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
    <div className="container mx-auto mt-8">
      {/* Error Handling */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          {error}
        </div>
      )}

      {/* Session Listings */}
      {sessions.length > 0 ? (
        sessions.map((sess) => (
          <div
            key={sess._id}
            className="bg-white shadow-md rounded-lg p-6 mb-6 hover:shadow-xl transition-all"
            style={{ border: '1px solid #ddd' }}
          >
            <h3 className="text-xl font-semibold text-blue-600">{sess.title}</h3>
            <p className="text-gray-700 mt-2"><strong></strong> {sess.description}</p>
            <p className="text-gray-700 mt-2"><strong>Conducted By:</strong> {sess.conductedByName} ({sess.conductedByEmail})</p>
            <p className="text-gray-700 mt-2"><strong>Scheduled Time:</strong> {new Date(sess.scheduleTime).toLocaleString()}</p>
            <p className="text-gray-700 mt-2"><strong>Status:</strong> {renderSessionStatus(sess.status)}</p>
            <p className="text-gray-700 mt-2"><strong>Duration:</strong> {sess.duration} minutes</p>
            
            <div className="mt-4">
              <Link to={sess.meetLink} target="_blank" rel="noopener noreferrer">
                <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  Join Session
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-lg">No sessions available at the moment.</div>
      )}
    </div>
  );
};

export default AllSessions;
