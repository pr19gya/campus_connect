
import { Route, Routes } from "react-router-dom"
import Register from "./app/login/Register"
import Login from "./app/login/Login"
import AllQuestions from "./app/questions/AllQuestions"
import CreateQuestion from "./app/questions/CreateQuestion"
import ThisQuestion from "./app/questions/ThisQuestion"
import Profile from "./app/login/Profile"
import AllSessions from "./app/mentorship/AllSessions"
import CreateSession from "./app/mentorship/CreateSession"
import MainPage from "./app/main/MainPage"
import OneProfile from "./app/login/OneProfile"



function App() {
 

  return (
    <>
    <Routes>
    <Route path="/" element={<MainPage/>}/>
      <Route path="/Questions" element={<AllQuestions/>}/>
      <Route path="/Create" element={<CreateQuestion/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/question/:id" element={<ThisQuestion />} />
      <Route path="/profile/:email" element={<OneProfile />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Mentorship" element={<AllSessions/>}/>
      <Route path="/CreateSession" element={<CreateSession/>}/>
    </Routes>
    </>
  )
}

export default App
