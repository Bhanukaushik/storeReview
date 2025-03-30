import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../context/authContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const UserDashboard = () => {
    const { user, token } = useAuth();
    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState({});
    const [search, setSearch] = useState({ name: "", address: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [ratingModal, setRatingModal] = useState({ show: false, storeId: null, rating: 1 });
    const [passwordModal, setPasswordModal] = useState({ show: false, oldPassword: "", newPassword: "" });

    useEffect(() => {
        fetchStores();
        fetchUserRatings();
    }, []);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/user/stores`, {
                params: search,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (Array.isArray(response.data)) {
                setStores(response.data);
            } else {
                console.error("Expected an array but received:", response.data);
                setMessage({ type: "danger", text: "Failed to fetch stores: Invalid data format." });
                setStores([]);
            }
        } catch (error) {
            console.error("Fetch Stores Error:", error.response?.data || error.message);
            setMessage({ type: "danger", text: "Failed to fetch stores." });
            setStores([]);
        }
        setLoading(false);
    };

    const fetchUserRatings = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/ratings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (Array.isArray(response.data)) {
                const userRatings = {};
                response.data.forEach((r) => (userRatings[r.store_id] = r.rating));
                setRatings(userRatings);
            } else {
                console.error("Expected an array but received:", response.data);
                setMessage({ type: "danger", text: "Failed to fetch ratings: Invalid data format." });
                setRatings({});
            }
        } catch (error) {
            console.error("Fetch Ratings Error:", error.response?.data || error.message);
            setMessage({ type: "danger", text: "Failed to fetch user ratings." });
            setRatings({});
        }
    };

    const handleRateStore = async () => {
        try {
            const { storeId, rating } = ratingModal;
            await axios.post(`${API_BASE_URL}/user/rate`, { store_id: storeId, rating }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            setRatings((prev) => ({ ...prev, [storeId]: rating }));
            setMessage({ type: "success", text: "Rating submitted successfully!" });
            fetchUserRatings(); // Refresh ratings after submitting
        } catch (error) {
            setMessage({ type: "danger", text: error.response?.data?.error || "Error submitting rating." });
        }
        setRatingModal({ show: false, storeId: null, rating: 1 });
    };

    const handleUpdatePassword = async () => {
        try {
            await axios.put(`${API_BASE_URL}/auth/update-password`, {
                email: user.email,
                password: passwordModal.newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            setMessage({ type: "success", text: "Password updated successfully!" });
        } catch (error) {
            setMessage({ type: "danger", text: error.response?.data?.error || "Error updating password." });
        }
        setPasswordModal({ show: false, oldPassword: "", newPassword: "" });
    };
// Star Rating Component
    const StarRating = ({ storeId, userRating }) => {
        const [rating, setRating] = useState(userRating || 0);
        const [hover, setHover] = useState(0);

        return (
            <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                        <button
                            type="button"
                            key={index}
                            className={`star ${index <= (hover || rating) ? "on" : "off"} btn btn-sm`}
                            onClick={() => {
                                setRating(index);
                                submitRating(storeId, index); // Submit rating on click
                            }}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                        >
                            <span className="star">&#9733;</span>
                        </button>
                    );
                })}
            </div>
        );
    };
return (
        <div className="container mt-4">
            <h2>User Dashboard</h2>

            {message && <Alert variant={message.type}>{message.text}</Alert>}

            <div className="d-flex justify-content-between mb-3">
                <input type="text" className="form-control me-2" placeholder="Search by name"
                    value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} />
                <input type="text" className="form-control me-2" placeholder="Search by address"
                    value={search.address} onChange={(e) => setSearch({ ...search, address: e.target.value })} />
                <Button variant="primary" onClick={fetchStores}>Search</Button>
            </div>

            {loading ? <Spinner animation="border" /> : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Store Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Overall Rating</th>
                            <th>Your Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((store) => (
                            <tr key={store.id}>
                                <td>{store.name}</td>
                                <td>{store.email}</td>
                                <td>{store.address}</td>
                                <td>{store.rating || "N/A"}</td>
                                <td>{ratings[store.id] || "Not Rated"}</td>
                                <td>
                                    <Button variant="primary" onClick={() => setRatingModal({ show: true, storeId: store.id, rating: ratings[store.id] || 1 })}>
                                        {ratings[store.id] ? "Update" : "Rate"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Button variant="warning" onClick={() => setPasswordModal({ show: true, oldPassword: "", newPassword: "" })}>
                Update Password
            </Button>

            {/* Rating Modal */}
            <Modal show={ratingModal.show} onHide={() => setRatingModal({ ...ratingModal, show: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate Store</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control as="select"
                                value={ratingModal.rating}
                                onChange={(e) => setRatingModal({ ...ratingModal, rating: parseInt(e.target.value) })}>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Stars</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setRatingModal({ ...ratingModal, show: false })}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleRateStore}>
                        Submit Rating
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Password Modal */}
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
        </div>
    );
};

export default UserDashboard;
