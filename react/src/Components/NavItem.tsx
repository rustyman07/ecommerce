import React from "react";
import { Link } from "react-router-dom";

interface NavItemProps {
    icon: React.ComponentType<any>;
    label: string;
    active?: boolean;
    sidebarOpen: boolean;
    to?: string;
}
const NavItem: React.FC<NavItemProps> = ({
    icon: Icon,
    label,
    active,
    sidebarOpen,
    to,
}) => {
    const content = (
        <button
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active
                    ? "bg-purple-700 text-white"
                    : "text-purple-100 hover:bg-purple-700 hover:text-white"
            }`}
        >
            <Icon className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">{label}</span>}
        </button>
    );

    return to ? <Link to={to}>{content}</Link> : content;
};

export default NavItem;
