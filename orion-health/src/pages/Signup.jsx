// src/pages/Signup.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import UserContext
import axios from '../utils/axiosInstance'; // Use Axios instance with interceptors
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

const Signup = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Not Selected',
    dob: '',
    address: {
      line1: '',
      line2: '',
    },
  });

  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Use setUser from UserContext

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name === 'line1' || name === 'line2') {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handler for form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Frontend validation
    if (!formData.name.trim()) {
      toast.error('Name is required.');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required.');
      return;
    }

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!formData.password) {
      toast.error('Password is required.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Phone number is required.');
      return;
    }

    // Optional: Add phone number regex validation
    // const phoneRegex = /^[0-9]{10}$/;
    // if (!phoneRegex.test(formData.phone)) {
    //   toast.error('Please enter a valid 10-digit phone number.');
    //   return;
    // }

    if (formData.gender === 'Not Selected') {
      toast.error('Please select your gender.');
      return;
    }

    if (!formData.address.line1.trim()) {
      toast.error('Address Line 1 is required.');
      return;
    }

    // Optional: Add more validation as needed

    try {
      setLoading(true); // Start loading

      // Send POST request to backend to register user
      const response = await axios.post('/api/user/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob || null, // Send null if dob is not provided
        address: formData.address,
      });

      // Assuming the backend sets the JWT token in an HTTP-only cookie
      // and returns the complete user object

      const { user } = response.data;
      console.log('User registered:', user);

      // Update user state in context
      setUser(user);

      // Optionally, you can fetch the profile again if needed
      // Navigate to the user's profile
      toast.success('Account created successfully. Redirecting to your profile...');
      navigate('/my-profile');

      // Reset form fields after successful signup
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        gender: 'Not Selected',
        dob: '',
        address: {
          line1: '',
          line2: '',
        },
      });
    } catch (error) {
      console.error('Error during sign-up:', error.response?.data || error.message);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with a status other than 2xx
        toast.error(error.response.data.message || 'Sign-up failed. Please try again.');
      } else if (error.request) {
        // Request was made but no response received
        toast.error('No response from server. Please try again later.');
      } else {
        // Something else happened
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600" // Enhanced background
    >
      <ToastContainer /> {/* Container for react-toastify notifications */}
      <div className="w-full max-w-lg p-8 space-y-6 bg-white bg-opacity-90 rounded-lg shadow-md backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up to Your Account</h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters.</p>
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
              Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="123-456-7890"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            {/* Optional: Add phone number format validation message */}
            {/* <p className="text-xs text-gray-500 mt-1">Enter a valid 10-digit phone number.</p> */}
          </div>

          {/* Gender Field */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
              Gender<span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="Not Selected" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer Not to Say">Prefer Not to Say</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {/* Date of Birth Field */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-600">
              Date of Birth<span className="text-gray-500"> (Optional)</span>
            </label>
            <input
              id="dob"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label htmlFor="line1" className="block text-sm font-medium text-gray-600">
              Address Line 1<span className="text-red-500">*</span>
            </label>
            <input
              id="line1"
              type="text"
              name="line1"
              value={formData.address.line1}
              onChange={handleChange}
              placeholder="Street address, P.O. box, etc."
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="line2" className="block text-sm font-medium text-gray-600">
              Address Line 2<span className="text-gray-500"> (Optional)</span>
            </label>
            <input
              id="line2"
              type="text"
              name="line2"
              value={formData.address.line2}
              onChange={handleChange}
              placeholder="Apartment, suite, unit, building, floor, etc."
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-indigo-600 hover:underline ml-1"
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