import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

function GuestLayout() {
    return (
        <div>
            <nav>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </nav>
            <Outlet />
        </div>
    );
}

export default GuestLayout;
