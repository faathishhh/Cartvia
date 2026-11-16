import React from 'react'
import NavBar from '../src/components/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from "./components/Footer";


const HomeLayout = () => {
  return (
    <div>
        <NavBar/>
        
        <Outlet/>
        
        <Footer />

    </div>
  )
}

export default HomeLayout