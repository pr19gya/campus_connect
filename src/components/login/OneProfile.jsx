import React, { useEffect, useState } from 'react';
import { base_url } from '../../base_url';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CardContainer, CardItem } from '../ui/3dcard';
import { CardBody } from '@material-tailwind/react';

const OneProfile = () => {
    const { email } = useParams();
  const [userDetail, setUserDetail] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
//   const email = localStorage.getItem('Email');
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
  }, [email, navigate]);

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
          setQuestions(data2.reverse());
        } else {
          console.log("Error fetching questions.");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setQuestions(prev => prev.filter(q => q.questionId !== questionId));
      } else {
        const errorData = await response.json();
        console.error("❌ Failed to delete question:", errorData.message || "Unknown error");
      }
    } catch (error) {
      console.error("🚨 Error deleting question:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container bg-slate-950 min-h-screen mx-auto pt-8">
      <div className="bg-slate-950 max-w-5xl m-auto shadow-md rounded-lg p-6 flex items-center mb-8">
        <div className="w-full">
          {userDetail ? (
            <>
              <h2 className="text-3xl text-slate-300 flex items-center justify-center font-bold">
                {userDetail.user.firstName} {userDetail.user.lastName}
              </h2>
              <p className="text-slate-300 flex items-center justify-center pt-5">{userDetail.user.college}</p>
              {/* <div className="flex items-center justify-center mt-3">
                <button
                  className="relative w-40 m-4 p-2 h-12 bg-slate-900 text-white rounded-md text-xl font-bold cursor-pointer z-10 group overflow-hidden"
                  type="button"
                  onClick={handleLogout}
                >
                  LogOut
                  <span className="absolute w-44 h-32 -top-8 -left-2 bg-cyan-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-bottom"></span>
                  <span className="absolute w-44 h-32 -top-8 -left-2 bg-cyan-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-bottom"></span>
                  <span className="absolute w-44 h-32 -top-8 -left-2 bg-cyan-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-bottom"></span>
                  <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-12 z-10">
                    LogOut
                  </span>
                </button>
              </div> */}
            </>
          ) : (
            <div>Loading user details...</div>
          )}
        </div>
      </div>

      {/* User's Questions Section */}
      <div className="bg-slate-950 max-w-5xl m-auto shadow-md rounded-lg p-6">
        <h3 className="text-2xl text-slate-300 font-bold mb-5 text-center">Questions by {userDetail.user.firstName}</h3>
        {questions.length > 0 ? (
          questions.map((ques) => (
            <div key={ques.questionId} className="border-b border-gray-200 pb-4 mb-4">
              <CardContainer className="inter-var">
                <CardBody className="bg-gray-50 relative group/card dark:bg-slate-950 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[65rem] h-auto rounded-xl p-6 border">
                  <Link to={`/question/${ques.questionId}`} className="text-blue-600 font-semibold text-lg">
                    <div className="mb-2">
                      {ques.tags && ques.tags.map((tag, index) => (
                        <span key={index} className="text-xs font-medium text-cyan-500 uppercase">{tag} </span>
                      ))}
                    </div>
                    <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
                      {ques.title}
                    </CardItem>
                    <CardItem translateZ="60" className="text-neutral-500 text-sm mt-2 dark:text-neutral-300">
                      {ques.description}
                    </CardItem>
                    {ques.imageUrl && (
                      <CardItem translateZ="100" className="w-full mt-4">
                        <img
                          src={ques.imageUrl}
                          height="1000"
                          width="1000"
                          className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                          alt="thumbnail"
                        />
                      </CardItem>
                    )}
                    <div className="flex justify-between items-center mt-20">
                      <CardItem translateZ={20} className="py-2 rounded-xl text-xs font-normal dark:text-cyan-500">
                        <b>Created at: {new Date(ques.createdAt).toLocaleDateString()}</b>
                      </CardItem>
                    </div>
                  </Link>
                  
                </CardBody>
              </CardContainer>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">Create questions to see a list of your created questions here.</div>
        )}
      </div>
    </div>
  );
};

export default OneProfile;
