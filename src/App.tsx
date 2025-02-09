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
        <Route path="/" element={<Signin/>}/>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/expense/:budgetId" element={<Expense />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
