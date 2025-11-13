import {
    BarChart3,
    ShoppingCart,
    Users,
    Package,
    Settings,
} from "lucide-react";
import NavItem from "./NavItem";
import { useState } from "react";

function Nav({ sidebarOpen }: { sidebarOpen: boolean }) {
    return (
        <nav className="flex-1 px-4 space-y-2">
            <NavItem
                icon={BarChart3}
                label="Dashboard"
                active
                sidebarOpen={sidebarOpen}
                to="/dashboard"
            />
            <NavItem
                icon={ShoppingCart}
                label="Orders"
                sidebarOpen={sidebarOpen}
            />
            <NavItem
                icon={Package}
                label="Products"
                sidebarOpen={sidebarOpen}
                to="/products"
            />
            <NavItem icon={Users} label="Customers" sidebarOpen={sidebarOpen} />
            <NavItem
                icon={Settings}
                label="Settings"
                sidebarOpen={sidebarOpen}
            />
        </nav>
    );
}

export default Nav;
