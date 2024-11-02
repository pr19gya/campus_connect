
import { Route, Routes } from "react-router-dom"
import Register from "./app/login/Register"
import Login from "./app/login/Login"
import AllQuestions from "./app/questions/AllQuestions"
import CreateQuestion from "./app/questions/CreateQuestion"
import ThisQuestion from "./app/questions/ThisQuestion"



function App() {
 

  return (
    <>
    <Routes>
      <Route path="/" element={<AllQuestions/>}/>
      <Route path="/Create" element={<CreateQuestion/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/question/:id" element={<ThisQuestion />} />
      
    </Routes>
    </>
  )
}

export default App
