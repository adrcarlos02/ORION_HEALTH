import React, { useState, useContext, useEffect } from 'react';
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
  const [isPolicyVisible, setIsPolicyVisible] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

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

  const onSubmitHandler = async () => {
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
        dob: formData.dob || null,
      });

      const { user } = response.data;
      toast.success('Account created successfully! Redirecting...');
      setUser(user);
      navigate('/my-profile');

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
        <form className="space-y-4">
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

          {/* Privacy Policy Button */}
          <button
            type="button"
            onClick={() => setIsPolicyVisible(true)}
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

       {/* Privacy Policy Modal */}
       {isPolicyVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-white rounded-lg p-6 space-y-4 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Privacy Policy</h3>
            <p className="mb-4 text-gray-700">
              At ORION Health, we are committed to protecting your privacy. This Privacy Policy
              outlines the types of information we collect, how we use it, and the measures we take
              to keep it secure.
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Information We Collect:</span> We may collect personal
              information such as your name, email address, and phone number when you contact us or
              use our services.
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">How We Use Your Information:</span> We use your
              information to respond to your inquiries, provide healthcare services, and improve our
              offerings. We do not share your information with third parties without your consent,
              except as required by law.
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Security Measures:</span> We employ industry-standard
              security practices to protect your information from unauthorized access and
              disclosure.
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Your Rights:</span> You have the right to request
              access to, correct, or delete your personal information. Please contact us if you wish
              to exercise these rights.
            </p>
            <p className="text-gray-700">
              If you have questions about our Privacy Policy, feel free to contact us at the email
              provided above.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsPolicyVisible(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsPolicyVisible(false);
                  onSubmitHandler();
                }}
                className="px-4 py-2 text-white bg-cyan-500 rounded hover:bg-cyan-600"
              >
                Agree and Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;