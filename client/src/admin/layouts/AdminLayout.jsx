import React from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        < div className="flex min-h-screen bg-gray-50" >

            
                <SideBar />

            <main className="flex-1 p-8">
                <Outlet />
            </main>

        </div >
    )
}

export default AdminLayout