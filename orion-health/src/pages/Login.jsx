import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { assets } from '../assets/assets';
import axios from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const bannerImages = [
    assets.BannerChildHealth,
    assets.BannerGeneralPhysician,
    assets.BannerMaternalHealth,
    assets.BannerNeurology,
    assets.BannerSkinHealth,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/login', { email, password });

      const { success, message, user } = response.data;
      if (success) {
        const profileResponse = await axios.get('/api/user/profile');
        if (profileResponse.data.success) {
          setUser(profileResponse.data.user);
          toast.success(message || 'Logged in successfully.');
          navigate('/my-profile');
        } else {
          toast.error(profileResponse.data.message || 'Profile loading failed.');
        }
      } else {
        toast.error(message || 'Login failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bannerImages[currentImageIndex]})`,
        backgroundColor: 'var(--bg-color)', // Dynamic background color
      }}
    >
      <ToastContainer /> {/* Toastify Container for notifications */}
      <div
        className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md backdrop-blur-sm"
        style={{
          backgroundColor: 'var(--bg-color)', // Use dynamic background
          color: 'var(--text-color)', // Dynamic text color
        }}
      >
        <h2
          className="text-2xl font-bold text-center"
          style={{ color: 'var(--text-color)' }}
        >
          Login to Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium" style={{ color: 'var(--text-color)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium" style={{ color: 'var(--text-color)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              style={{ backgroundColor: 'var(--input-bg-color)', color: 'var(--text-color)' }}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--text-color)' }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-semibold text-blue-500 hover:underline ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;