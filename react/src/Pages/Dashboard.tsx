import React, { useState, useEffect } from "react";
import {
    ShoppingCart,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    Menu,
    X,
    LogOut,
    Search,
    Bell,
} from "lucide-react";

// Mock data - replace with actual API calls
const mockStats = {
    totalRevenue: 45231.89,
    totalOrders: 234,
    totalCustomers: 1234,
    totalProducts: 567,
    revenueChange: 12.5,
    ordersChange: 8.3,
    customersChange: 15.2,
    productsChange: 3.1,
};

const mockRecentOrders = [
    {
        id: "#ORD-001",
        customer: "John Doe",
        amount: 1234.56,
        status: "delivered",
        date: "2024-11-13",
    },
    {
        id: "#ORD-002",
        customer: "Jane Smith",
        amount: 567.89,
        status: "processing",
        date: "2024-11-12",
    },
    {
        id: "#ORD-003",
        customer: "Bob Johnson",
        amount: 890.12,
        status: "shipped",
        date: "2024-11-12",
    },
    {
        id: "#ORD-004",
        customer: "Alice Brown",
        amount: 345.67,
        status: "pending",
        date: "2024-11-11",
    },
    {
        id: "#ORD-005",
        customer: "Charlie Wilson",
        amount: 678.9,
        status: "delivered",
        date: "2024-11-11",
    },
];

const mockTopProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        sales: 234,
        revenue: 23456.78,
        stock: 45,
    },
    { id: 2, name: "Smart Watch", sales: 189, revenue: 18900.0, stock: 23 },
    { id: 3, name: "Laptop Stand", sales: 156, revenue: 7800.0, stock: 67 },
    { id: 4, name: "USB-C Cable", sales: 345, revenue: 3450.0, stock: 120 },
    { id: 5, name: "Phone Case", sales: 267, revenue: 5340.0, stock: 89 },
];

// Helper function for status colors
const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        delivered: "bg-green-100 text-green-800",
        processing: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        pending: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
};

// StatCard Component
interface StatCardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ComponentType<any>;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    color,
}) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                    {title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <div className="flex items-center mt-2">
                    <TrendingUp
                        className={`w-4 h-4 ${
                            change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                    />
                    <span
                        className={`text-sm ml-1 ${
                            change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {change >= 0 ? "+" : ""}
                        {change}%
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                        vs last month
                    </span>
                </div>
            </div>
            <div className={`${color} p-4 rounded-xl`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

// NavItem Component

export default function Dashboard() {
    const [user, setUser] = useState({
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load user data from localStorage or API
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="flex items-center justify-between px-8 py-4">
                    <div className="flex items-center flex-1">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search orders, products, customers..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user.role}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Dashboard Overview
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Welcome back! Here's what's happening today.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Revenue"
                            value={`₱${mockStats.totalRevenue.toLocaleString()}`}
                            change={mockStats.revenueChange}
                            icon={DollarSign}
                            color="bg-gradient-to-br from-green-500 to-green-600"
                        />
                        <StatCard
                            title="Total Orders"
                            value={mockStats.totalOrders.toLocaleString()}
                            change={mockStats.ordersChange}
                            icon={ShoppingCart}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                        <StatCard
                            title="Total Customers"
                            value={mockStats.totalCustomers.toLocaleString()}
                            change={mockStats.customersChange}
                            icon={Users}
                            color="bg-gradient-to-br from-purple-500 to-purple-600"
                        />
                        <StatCard
                            title="Total Products"
                            value={mockStats.totalProducts.toLocaleString()}
                            change={mockStats.productsChange}
                            icon={Package}
                            color="bg-gradient-to-br from-orange-500 to-orange-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Recent Orders
                                </h3>
                                <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                                    View All
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                                            <th className="pb-3 font-semibold">
                                                Order ID
                                            </th>
                                            <th className="pb-3 font-semibold">
                                                Customer
                                            </th>
                                            <th className="pb-3 font-semibold">
                                                Amount
                                            </th>
                                            <th className="pb-3 font-semibold">
                                                Status
                                            </th>
                                            <th className="pb-3 font-semibold">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockRecentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-4 font-medium text-gray-900">
                                                    {order.id}
                                                </td>
                                                <td className="py-4 text-gray-600">
                                                    {order.customer}
                                                </td>
                                                <td className="py-4 font-semibold text-gray-900">
                                                    ₱
                                                    {order.amount.toLocaleString()}
                                                </td>
                                                <td className="py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-600">
                                                    {order.date}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Top Products
                            </h3>

                            <div className="space-y-4">
                                {mockTopProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {product.sales} sales
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                ₱
                                                {product.revenue.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {product.stock} in stock
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
