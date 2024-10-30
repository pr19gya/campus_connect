
import { Route, Routes } from "react-router-dom"
import Register from "./app/login/Register"
import Login from "./app/login/Login"
import AllQuestions from "./app/questions/AllQuestions"
import CreateQuestion from "./app/questions/CreateQuestion"


function App() {
 

  return (
    <>
    <Routes>
      <Route path="/" element={<AllQuestions/>}/>
      <Route path="/Create" element={<CreateQuestion/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/Login" element={<Login/>}/>
      
    </Routes>
    </>
  )
}

export default App
