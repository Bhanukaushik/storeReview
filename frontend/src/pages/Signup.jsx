import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Validation Schema
const signupSchema = yup.object().shape({
    name: yup.string().min(3).max(60).required(),
    email: yup.string().email().required(),
    address: yup.string().max(400).required(),
    password: yup.string().min(8).max(16).matches(/[A-Z]/, "Must include an uppercase letter").matches(/[!@#$%^&*]/, "Must include a special character").required(),
});

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(signupSchema) });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await axios.post(`${API_BASE_URL}/auth/register`, data);
            toast.success("Signup successful! Please log in.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label>Name</label>
                    <input className="form-control" {...register("name")} />
                    <p className="text-danger">{errors.name?.message}</p>
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control" type="email" {...register("email")} />
                    <p className="text-danger">{errors.email?.message}</p>
                </div>
                <div className="mb-3">
                    <label>Address</label>
                    <input className="form-control" {...register("address")} />
                    <p className="text-danger">{errors.address?.message}</p>
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input className="form-control" type="password" {...register("password")} />
                    <p className="text-danger">{errors.password?.message}</p>
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
