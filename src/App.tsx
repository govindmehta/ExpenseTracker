import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import HomePage from "./pages/Home"
import Expense from "./pages/Expense"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/home" element={<HomePage email={"govind@gmail.com"} name={"Govind"}/>}/>
        <Route path="/expense" element={<Expense/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
