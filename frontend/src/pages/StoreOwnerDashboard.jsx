import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Table, Alert, Spinner } from "react-bootstrap";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StoreOwnerDashboard = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [message, setMessage] = useState(null);
    const [passwordModal, setPasswordModal] = useState({ show: false, oldPassword: "", newPassword: "" });

    useEffect(() => {
        fetchRatings();
        fetchAverageRating();
    }, [token]);

    const fetchRatings = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/store-owner/ratings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                setRatings(response.data);
            } else {
                console.error("Unexpected data format for ratings:", response.data);
                setMessage({ type: "danger", text: "Failed to load ratings." });
            }
        } catch (error) {
            console.error("Error fetching ratings:", error);
            setMessage({ type: "danger", text: "Failed to fetch ratings." });
        }
    };

    const fetchAverageRating = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/store-owner/average-rating`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAverageRating(response.data.average_rating || 0);
        } catch (error) {
            console.error("Error fetching average rating:", error);
            setMessage({ type: "danger", text: "Failed to fetch average rating." });
        }
    };

    const handleUpdatePassword = async () => {
        if (!passwordModal.oldPassword || !passwordModal.newPassword) {
          setMessage({ type: "danger", text: "Both old and new passwords are required" });
          return;
        }
      
        try {
          await axios.put(`${API_BASE_URL}/auth/update-password`, 
            {
              oldPassword: passwordModal.oldPassword,
              newPassword: passwordModal.newPassword
            }, 
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setMessage({ type: "success", text: "Password updated successfully!" });
        } catch (error) {
          console.error("Update error:", error.response?.data);
          setMessage({ 
            type: "danger", 
            text: error.response?.data?.error || "Password update failed. Check console for details."
          });
        }
        setPasswordModal({ show: false, oldPassword: "", newPassword: "" });
      };
      
    
    

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="container mt-4">
            <h2>Store Owner Dashboard</h2>

            {message && <Alert variant={message.type}>{message.text}</Alert>}

            <div>
                <h3>Ratings for Your Store</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((rating, index) => (
                            <tr key={index}>
                                <td>{rating.name}</td>
                                <td>{rating.rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <div>
                <h3>Average Rating: {averageRating}</h3>
            </div>

            <Button variant="warning" onClick={() => setPasswordModal({ show: true, oldPassword: "", newPassword: "" })}>
                Update Password
            </Button>

            <Modal show={passwordModal.show} onHide={() => setPasswordModal({ ...passwordModal, show: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Old Password"
                                value={passwordModal.oldPassword}
                                onChange={(e) => setPasswordModal({ ...passwordModal, oldPassword: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="New Password"
                                value={passwordModal.newPassword}
                                onChange={(e) => setPasswordModal({ ...passwordModal, newPassword: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setPasswordModal({ ...passwordModal, show: false })}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdatePassword}>
                        Update Password
                    </Button>
                </Modal.Footer>
            </Modal>

            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default StoreOwnerDashboard;
