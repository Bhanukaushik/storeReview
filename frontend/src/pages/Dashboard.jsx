import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
                    headers: { Authorization: token },
                });

                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    if (!user) return <h2>Loading...</h2>;

    return (
        <div className="container mt-5">
            <h1>Welcome, {user.name}</h1>
            <h3>Role: {user.role}</h3>
            {user.role === "admin" && <AdminDashboard />}
            {user.role === "user" && <UserDashboard />}
            {user.role === "store_owner" && <StoreOwnerDashboard />}
        </div>
    );
};

export default Dashboard;
