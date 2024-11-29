import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; 
import axios from '../utils/axiosInstance'; 
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
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

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'line1' || name === 'line2') {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validation checks
    if (!formData.name.trim()) return toast.error('Name is required.');
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error('Valid email is required.');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (!formData.phone.trim()) return toast.error('Phone number is required.');
    if (formData.gender === 'Not Selected') return toast.error('Please select your gender.');
    if (!formData.address.line1.trim()) return toast.error('Address Line 1 is required.');

    try {
      setLoading(true);

      const response = await axios.post('/api/user/register', {
        ...formData,
        dob: formData.dob || null, // Send null if dob is not provided
      });

      const { user } = response.data;
      toast.success('Account created successfully! Redirecting...');
      setUser(user);
      navigate('/my-profile');

      // Reset the form
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
      toast.error(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
      <ToastContainer />
      <div className="w-full max-w-lg p-8 bg-white bg-opacity-90 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={onSubmitHandler}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">At least 6 characters.</p>
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* Gender Dropdown */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              required
            >
              <option value="Not Selected" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer Not to Say">Prefer Not to Say</option>
            </select>
          </div>

          {/* Date of Birth Field */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-600 mb-1">
              Date of Birth <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          {/* Address Fields */}
          <div>
            <label htmlFor="line1" className="block text-sm font-medium text-gray-600 mb-1">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              id="line1"
              name="line1"
              type="text"
              value={formData.address.line1}
              onChange={handleChange}
              placeholder="Street address, P.O. box, etc."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="line2" className="block text-sm font-medium text-gray-600 mb-1">
              Address Line 2 <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              id="line2"
              name="line2"
              type="text"
              value={formData.address.line2}
              onChange={handleChange}
              placeholder="Apartment, suite, unit, etc."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-cyan-500 hover:underline font-semibold"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;