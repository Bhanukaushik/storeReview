import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ✅ Import Navigate
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./routes/ProtectedRoute";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Protected Routes for Normal Users */}
          <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
          </Route>

          {/* Protected Routes for Store Owners */}
          <Route element={<ProtectedRoutes allowedRoles={["store_owner"]} />}>
            <Route path="/store-owner-dashboard" element={<StoreOwnerDashboard />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* ✅ Use Navigate */}
        </Routes>
      </div>
    </>
  );
};

export default App;
