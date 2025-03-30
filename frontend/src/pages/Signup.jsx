import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button } from 'react-bootstrap';  // Import Bootstrap components

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Validation Schema
const signupSchema = yup.object().shape({
    name: yup.string().min(3).max(60).required(),
    email: yup.string().email().required(),
    address: yup.string().max(400).required(),
    password: yup.string().min(8).max(16).matches(/[A-Z]/, "Must include an uppercase letter").matches(/[!@#$%^&*]/, "Must include a special character").required(),
    role: yup.string().oneOf(['user', 'store_owner', 'admin']).required(), // Add role validation
});

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(signupSchema) });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await axios.post(`${API_BASE_URL}/auth/signup`, data); // Use /auth/signup
            toast.success("Signup successful! Please log in.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Sign Up</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control {...register("name")} isInvalid={!!errors.name} />
                    <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" {...register("email")} isInvalid={!!errors.email} />
                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control {...register("address")} isInvalid={!!errors.address} />
                    <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" {...register("password")} isInvalid={!!errors.password} />
                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select {...register("role")} isInvalid={!!errors.role}>
                        <option value="user">User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="admin">Admin</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.role?.message}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary">Sign Up</Button>
            </Form>
        </div>
    );
};

export default Signup;
