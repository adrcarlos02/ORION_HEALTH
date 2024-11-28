// src/pages/Signup.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import UserContext
import axios from '../utils/axiosInstance'; // Use Axios instance with interceptors
import Cookies from 'js-cookie';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Use setUser from UserContext

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Send POST request to backend to register user
      const response = await axios.post('/api/user/register', {
        email,
        name,
        password,
      });

      const { token, user } = response.data;
      console.log('User registered:', user);

      Cookies.set('jwtToken', token, { expires: 1 }); // Expires in 1 day

      // Update user state in context
      setUser(user);

      // Navigate to the user's profile
      navigate('/my-profile');

      // Reset form fields after successful signup
      setEmail('');
      setName('');
      setPassword('');
    } catch (error) {
      console.error('Error during sign-up:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Sign-up failed. Please try again.');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-[#001f3f]" // Navy blue background
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up to Your Account</h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-blue-500 hover:underline ml-1"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;