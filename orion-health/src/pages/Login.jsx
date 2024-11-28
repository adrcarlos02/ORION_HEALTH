// src/pages/Login.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'; 
import axios from 'axios'; // Import Axios for HTTP requests

const Login = () => {
  const bannerImages = [
    assets.BannerChildHealth,
    assets.BannerGeneralPhysician,
    assets.BannerMaternalHealth,
    assets.BannerNeurology,
    assets.BannerSkinHealth,
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (isSigningUp) {
      // Handle sign-up logic
      try {
        const response = await axios.post('http://localhost:7001/register', { email, name, password });
        console.log('User created:', response.data);
        setIsSigningUp(false); // Switch to login mode after signup
        resetFormFields(); // Reset form fields after signup
        alert('Account created successfully. Please log in.');
      } catch (error) {
        console.error('Error during sign-up:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Sign-up failed. Please try again.');
      }
    } else {
      // Handle login logic
      try {
        const response = await axios.post('http://localhost:5000/login', { email, password });
        const { token } = response.data;
        console.log('Logging in with token:', token);
        localStorage.setItem('jwtToken', token); // Store the JWT in local storage

        // Redirect to MyProfile
        navigate('/my-profile');
        resetFormFields(); // Reset fields after successful login
      } catch (error) {
        console.error('Error during login:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Invalid email or password. Please try again.');
      }
    }
  };

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImages[currentImageIndex]})` }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isSigningUp ? 'Sign Up' : 'Login'} to Your Account
        </h2>
        
        <form className="space-y-4" onSubmit={onSubmitHandler}>
          {isSigningUp && (
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
          )}
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
            {isSigningUp ? 'Create Account' : 'Log In'}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isSigningUp ? "Already have an account?" : "Don't have an account?"} 
            <button 
              onClick={() => setIsSigningUp(!isSigningUp)} 
              className="font-semibold text-blue-500 hover:underline"
            >
              {isSigningUp ? 'Login' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;