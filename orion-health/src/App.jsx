// src/App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import { UserContext } from './context/UserContext'; // Import UserContext
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MyProfile from './pages/MyProfile'; // Import MyProfile component
import './index.css';

const PrivateRoute = ({ element }) => {
  const { user } = React.useContext(UserContext); // Use UserContext
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <UserProvider>
      <div className='mx-4 sm:mx-[10%]'>
        <Navbar /> {/* No need to pass user and setUser */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<PrivateRoute element={<Doctors />} />} />
          <Route path='/doctors/:speciality' element={<PrivateRoute element={<Doctors />} />} />
          <Route path='/login' element={<Login />} /> {/* No need to pass setUser */}
          <Route path='/signup' element={<Signup />} /> {/* If Signup is still used */}
          <Route path='/my-profile' element={<PrivateRoute element={<MyProfile />} />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-appointments' element={<PrivateRoute element={<MyAppointments />} />} />
          <Route path='/appointment/:docId' element={<PrivateRoute element={<Appointment />} />} />
        </Routes>
        <Footer />
      </div>
    </UserProvider>
  );
};

export default App;