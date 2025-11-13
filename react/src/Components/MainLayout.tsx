import React, { useState } from "react";
import { Menu, X } from "lucide-react";

import { Outlet } from "react-router-dom";
import Nav from "./Nav";

function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <aside
                className={`${
                    sidebarOpen ? "w-64" : "w-20"
                } bg-gradient-to-b from-purple-600 to-purple-800 text-white transition-all duration-300 flex flex-col`}
            >
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen && (
                        <h1 className="text-2xl font-bold">E-Store</h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-purple-700 rounded-lg"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <Nav sidebarOpen={sidebarOpen} />

                <div className="p-4 border-t border-purple-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                        {/* <LogOut className="w-5 h-5" /> */}
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>
            <Outlet />
        </div>
    );
}

export default MainLayout;
