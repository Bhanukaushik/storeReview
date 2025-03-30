import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">401 - Unauthorized Access</h1>
      <p className="lead">You don't have permission to view this page</p>
      <button 
        className="btn btn-primary"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
