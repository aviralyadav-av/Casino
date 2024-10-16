import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config"; // Import the configuration file with API URL and token key

import casino from "../Images/casino.jpg"; // Import an illustration image for the login page

// Login component for user authentication
const Login = () => {
  // State variables to manage form input and errors
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Send a POST request to the login endpoint with username and password
      const response = await axios.post(`${config.API_URL}/login`, {
        username,
        password,
      });

      // Store the received token in local storage
      localStorage.setItem(config.TOKEN_KEY, response.data.token);

      // Navigate to the dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      // Handle errors by setting an error message to be displayed
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Left side: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Hello, Welcome
          </h1>
          <p className="text-center mb-8">
            Hey, welcome back to your special place
          </p>

          {/* Login form */}
          <form onSubmit={handleSubmit}>
            {/* Username input */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Password input */}
            <div className="mb-4">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Remember me checkbox */}
            <div className="mb-4">
              <input
                type="checkbox"
                id="remember"
                className="mr-2 leading-tight"
              />
              <label htmlFor="remember" className="text-sm">
                Remember me
              </label>
            </div>

            {/* Forgot password link */}
            <div className="mb-4 text-right">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-800">
                Forgot Password?
              </a>
            </div>

            {/* Submit button */}
            <div className="mb-4">
              <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>

            {/* Error message display */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <a href="#" className="text-purple-500 hover:text-purple-800">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Right side: Illustration */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="max-w-lg">
          <img src={casino} alt="Illustration" className="rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;
