"use client"

import { Outlet } from "react-router-dom"
import { useState } from "react"
import SideMenu from "../components/SideBar"
import { ToastContainer } from "react-toastify"

export default function AppLayout() {
    const [sidebarVisible, setSidebarVisible] = useState(true)

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
    }

    return (
        <div className="h-screen bg-background text-foreground font-sans flex">
            <SideMenu isVisible={sidebarVisible} onToggle={toggleSidebar} />
            <main className="flex-1 bg-background overflow-auto">
                <Outlet />
            </main>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} position="top-right" theme="light" />
        </div>
    )
}
