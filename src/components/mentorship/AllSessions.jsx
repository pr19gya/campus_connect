import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';

const AllSessions = () => {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch(`${base_url}mentor/getall-mentor-sessions`);

                if (response.ok) {
                    const data = await response.json();
                    setSessions(data.data); // Access 'data' array directly
                    console.log(data.data);
                } else {
                    console.log("Error fetching sessions data");
                }
            } catch (error) {
                console.log("Fetch error:", error);
            }
        };
        fetchSessions();
    }, []);

    return (
        <div>
            <Link to="/CreateSession"><button>Create a session</button></Link>
            {sessions.length > 0 ? (
                sessions.map((sess) => (
                    <div key={sess._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
                        <h3>{sess.title}</h3>
                        <p><strong>Description:</strong> {sess.description}</p>
                        <p><strong>Conducted By:</strong> {sess.conductedByName} ({sess.conductedByEmail})</p>
                        <p><strong>Scheduled Time:</strong> {new Date(sess.scheduleTime).toLocaleString()}</p>
                        <p><strong>Status:</strong> {sess.status}</p>
                        <p><strong>Duration:</strong> {sess.duration} minutes</p>
                        <Link to={sess.meetLink} target="_blank" rel="noopener noreferrer">
                            <button>Join Session</button>
                        </Link>
                    </div>
                ))
            ) : (
                <div>No sessions yet</div>
            )}
        </div>
    );
};

export default AllSessions;
