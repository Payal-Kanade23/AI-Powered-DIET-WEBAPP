import React from 'react';
import { Link , useLocation} from 'react-router-dom';
import { useEffect , useState } from 'react';

import logo from "./assets/green-logo-transparent-background_943194-17985.avif"
function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/"
  const [scrolled , setScrolled] = useState(false);
  useEffect(()=>{
    const handleScroll = () =>{
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll" , handleScroll);
    return ()=> window.removeEventListener("scroll",handleScroll);
  },[])
  const transparent = isHome && !scrolled; 
  return (
  
      
<div  className={`fixed flex justify-start items-center text-xl px-10 space-x-80 gap-50 w-full h-[70px] z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent text-white"
          : "bg-green-900 text-white shadow-md"
      }`}>

  <div >
        <img src={logo} className='h-[50px] w-[50px] rounded-full'></img>
  </div>
        <div className='flex justify-space gap-10'>
           <Link to="/">Home</Link>
            <Link to="/topic">Category</Link>

      <Link to="/scan">Scan</Link>

      <Link to="/about">About</Link>
        </div>
        
        

    </div>

  );
}

export default Navbar;
