import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';
// import placeholderProfilePic from '../assets/placeholder-profile.png'; // Add a placeholder profile image

const Profile = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [questions, setQuestions] = useState([]);
  const email = localStorage.getItem('Email');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response1 = await fetch(`${base_url}auth/users?email=${email}`);
        const response2 = await fetch(`${base_url}question/user-questions?email=${email}`);

        if (response1.ok) {
          const data1 = await response1.json();
          setUserDetail(data1);
        } else {
          console.log("Error fetching user details.");
        }

        if (response2.ok) {
          const data2 = await response2.json();
          setQuestions(data2);
        } else {
          console.log("Error fetching questions.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserDetails();
  }, [email]);

  const handleDelete = async (questionId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${base_url}question/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuestions((prevQuestions) => prevQuestions.filter((ques) => ques.questionId !== questionId));
        console.log("Question deleted successfully.");
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      {/* User Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 flex items-center mb-8">
        {/* <img
          src={userDetail?.user.profilePic || placeholderProfilePic}
          alt="Profile"
          className="w-16 h-16 rounded-full mr-4"
        /> */}
        <div>
          {userDetail ? (
            <>
              <h2 className="text-xl font-bold">{userDetail.user.firstName} {userDetail.user.lastName}</h2>
              <p className="text-gray-600">{userDetail.user.email}</p>
              {/* <Link to="/edit-profile" className="text-blue-500 underline mt-2 inline-block">Edit Profile</Link> */}
            </>
          ) : (
            <div>Loading user details...</div>
          )}
        </div>
      </div>

      {/* User's Questions Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Your Questions</h3>
        {questions.length > 0 ? (
          questions.map((ques) => (
            <div
              key={ques.questionId}
              className="border-b border-gray-200 pb-4 mb-4"
            >
              <Link to={`/question/${ques.questionId}`} className="text-blue-600 font-semibold text-lg">
                {ques.title}
              </Link>
              <p className="text-gray-700 mt-2">{ques.description}</p>
              <p className="text-gray-500 text-sm mt-1">Created at: {new Date(ques.createdAt).toLocaleDateString()}</p>
              <div className="flex items-center mt-3">
                <button
                  onClick={() => handleDelete(ques.questionId)}
                  className="text-red-500 hover:text-red-700 mr-4"
                >
                  Delete
                </button>
                <Link
                  to={`/edit-question/${ques.questionId}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">Create questions to see a list of your created questions here.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
