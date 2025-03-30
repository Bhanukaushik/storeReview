import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);  // Add token state
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize auth state
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");  // Retrieve token

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
        if (storedToken) {
            setToken(storedToken);  // Set the token
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            const { user: userData, token: newToken } = response.data;  // Extract token as newToken

            if (!userData || !userData.role) {
                throw new Error("Invalid response from server.");
            }

            localStorage.setItem("token", newToken);  // Save the new token
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setToken(newToken);  // Update token state

            // Redirect based on role
            switch (userData.role) {
                case "admin":
                    navigate("/admin-dashboard");
                    break;
                case "user":
                    navigate("/user-dashboard");
                    break;
                case "store_owner":
                    navigate("/store-owner-dashboard");
                    break;
                default:
                    navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Invalid credentials.");
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);  // Clear the token
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
