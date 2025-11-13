import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./Components/GuestLayout";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";

const router = createBrowserRouter([
    {
        element: <GuestLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
        ],
    },
    {
        element: <MainLayout />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/products", element: <Products /> },
            // { path: "/orderlist", element: <OrderListPage /> },
            // { path: "/order", element: <Order /> },
        ],
    },
]);

export default router;
