import React, { useState } from 'react';
import adminAxiosInstance from '../utils/adminAxiosInstance'; // Use configured Axios instance
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminForm = ({ admin, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: admin ? admin.name : '',
    email: admin ? admin.email : '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Track form submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!admin && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true); // Start loading state
      if (admin) {
        const response = await adminAxiosInstance.put(`/admins/${admin.id}`, formData);
        console.log('Updating admin profile with data:', formData);
        console.log('Response Data:', response.data);
        toast.success('Admin updated successfully!'); // Success notification
      } else {
        const response = await adminAxiosInstance.post('/admins', formData);
        console.log('Creating new admin with data:', formData);
        console.log('Response Data:', response.data);
        toast.success('Admin created successfully!'); // Success notification
      }

      onSubmit(); // Refresh data
      setFormData({ name: '', email: '', password: '' }); // Clear form
    } catch (error) {
      // Handle errors without affecting the token
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        // Redirect to login if needed
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        const errorMessage =
          error.response?.data?.message || 'Error saving admin. Please try again.';
        toast.error(errorMessage);
        console.error('Error saving admin:', error);
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-label="Admin Name"
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-label="Admin Email"
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {!admin && (
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!admin}
            aria-label="Admin Password"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg shadow-md transition focus:outline-none ${
            loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring focus:ring-blue-300'
          }`}
        >
          {loading ? 'Saving...' : admin ? 'Update Admin' : 'Create Admin'}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;