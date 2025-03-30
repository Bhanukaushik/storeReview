import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Alert, Button, Form, Modal, Table, Spinner } from 'react-bootstrap'; // Import missing components

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newStore, setNewStore] = useState({ name: "", email: "", address: "",owner_id:"" });
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "user" }); // Default role set to "user"
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            fetchStats();
            fetchStores();
            fetchUsers();
        }
    }, [token]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
            setMessage({ type: "danger", text: "Failed to fetch statistics." });
        }
    };

    const fetchStores = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/stores`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (Array.isArray(response.data)) {
                setStores(response.data);
            } else {
                console.error("Expected an array but received:", response.data);
                setMessage({ type: "danger", text: "Failed to fetch stores: Invalid data format." });
                setStores([]);
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
            setMessage({ type: "danger", text: "Failed to fetch stores." });
            setStores([]);
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error("Expected an array but received:", response.data);
                setMessage({ type: "danger", text: "Failed to fetch users: Invalid data format." });
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setMessage({ type: "danger", text: "Failed to fetch users." });
            setUsers([]);
        }
        setLoading(false);
    };

    const fetchUserDetails = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedUser(response.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setMessage({ type: "danger", text: "Failed to fetch user details." });
        }
    };

    const addStore = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/admin/add-store`, newStore, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStores();
            setNewStore({ name: "", email: "", address: "",owner_id:"" });
            setMessage({ type: "success", text: "Store added successfully." });
        } catch (error) {
            console.error("Error adding store:", error);
            setMessage({ type: "danger", text: "Failed to add store." });
        }
    };

    const addUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/admin/add-user`, { ...newUser, role: newUser.role.toLowerCase() }, { // Ensure lowercase roles
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
            setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
            setMessage({ type: "success", text: "User added successfully." });
        } catch (error) {
            console.error("Error adding user:", error);
            setMessage({ type: "danger", text: "Failed to add user." });
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            {message && <Alert variant={message.type}>{message.text}</Alert>}

            <div className="row">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Users</h5>
                            <p className="card-text display-6">{stats.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Stores</h5>
                            <p className="card-text display-6">{stats.totalStores || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Total Ratings</h5>
                            <p className="card-text display-6">{stats.totalRatings || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <h3>Stores</h3>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores
                            .filter((store) =>
                                Object.values(store).some(
                                    (value) =>
                                        typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                            )
                            .map((store) => (
                                <tr key={store.id}>
                                    <td>{store.name}</td>
                                    <td>{store.email}</td>
                                    <td>{store.address}</td>
                                    <td>{store.rating || "N/A"}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            )}

            <h3>Users</h3>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .filter((user) =>
                                Object.values(user).some(
                                    (value) =>
                                        typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                            )
                            .map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <Button variant="info" size="sm" onClick={() => fetchUserDetails(user.id)}>
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            )}
            <Form onSubmit={addStore}>
                <h3>Add New Store</h3>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Store Name"
                        value={newStore.name}
                        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Store Email"
                        value={newStore.email}
                        onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Store Address"
                        value={newStore.address}
                        onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                        required
                    />
                     <input
                        type="text"
                        className="form-control"
                        placeholder="Store owner id"
                        value={newStore.owner_id}
                        onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}
                        required
                    />
                    <Button variant="success" type="submit">
                        Add Store
                    </Button>
                </div>
            </Form>
            <Form onSubmit={addUser}>
                <h3>Add New User</h3>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="User Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="User Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="User Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="User Address"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <Form.Control
                        as="select"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="store_owner">Store Owner</option>
                    </Form.Control>
                </div>
                <Button variant="success" type="submit">
                    Add User
                </Button>
            </Form>
            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
            <Modal show={selectedUser !== null} onHide={() => setSelectedUser(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <>
                            <p>Name: {selectedUser.name}</p>
                            <p>Email: {selectedUser.email}</p>
                            <p>Address: {selectedUser.address}</p>
                            <p>Role: {selectedUser.role}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
