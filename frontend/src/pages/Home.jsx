import React from "react";
import image from "../assets/Designer.jpg"
const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Left Side - Text Content */}
        <div className="col-md-6 text-center text-md-start">
          <h1 className="display-4 fw-bold">Discover & Rate Stores</h1>
          <p className="lead">
            Find stores, leave reviews, and help others make informed decisions.
          </p>
          <a href="/stores" className="btn btn-primary btn-lg">
            Explore Stores <i className="bi bi-arrow-right"></i>
          </a>
        </div>

        {/* Right Side - Image */}
        <div className="col-md-6 text-center">
          <img
            src={image} // Replace this with the generated image
            alt="Store Reviews Platform"
            style={{ maxWidth: "90%", borderRadius: "20px" }}
            className="img-fluid rounded shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
