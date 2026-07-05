import { BrowserRouter , Routes , Route } from "react-router-dom"
import About from "./pages/About"
import Scan from "./pages/Scan"
import Topic from "./pages/Topic"
import Home from "./pages/Home"
import Navbar from "./Navbar"
import Footer from "./pages/Footer"
import Register from "./pages/Register"
import Login from "./pages/Login"

function App() {

  return (
    <>
   <BrowserRouter>
   <Navbar/>
   <Routes>
    
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/scan" element={<Scan/>}/>
    <Route path="/topic" element={<Topic/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/login" element={<Login/>}/>

   </Routes>
   <Footer/>
   </BrowserRouter>
    </>
  )
}

export default App
