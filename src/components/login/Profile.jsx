import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [questions, setQuestions] = useState([]);
  const email = localStorage.getItem('Email');
  console.log(email);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response1 = await fetch(`${base_url}auth/users?email=${email}`);
        const response2 = await fetch(`${base_url}question/user-questions?email=${email}`);

        if (response1.ok) {
          const data1 = await response1.json();
          setUserDetail(data1);
          console.log(data1);
        } else {
          console.log("Error fetching user details.");
        }

        if (response2.ok) {
          const data2 = await response2.json();
          setQuestions(data2);
          console.log(data2);
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
    <div>
      {userDetail ? (
        <div>Hi {userDetail.user.firstName}!</div>
      ) : (
        <div>Loading user details...</div>
      )}
      {questions.length > 0 ? (
        questions.map((ques) => (
          <div key={ques.questionId} style={{ marginBottom: '20px' }}>
            <Link to={`/question/${ques.questionId}`}>
              <div>Title: {ques.title}</div>
              <div>Description: {ques.description}</div>
              <div>Created at: {ques.createdAt}</div>
            </Link>
            <button onClick={() => handleDelete(ques.questionId)}>Delete</button>
          </div>
        ))
      ) : (
        <div>Create questions to see a list of your created questions here.</div>
      )}
    </div>
  );
};

export default Profile;
