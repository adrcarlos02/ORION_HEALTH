// src/App.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ThemeProvider from "./context/ThemeContext"; // Import ThemeProvider
import { UserContext } from "./context/UserContext";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MyProfile from "./pages/MyProfile";
import NotFound from "./pages/NotFound"; // Import NotFound page
import "./index.css";

const PrivateRoute = ({ element }) => {
  const { user } = React.useContext(UserContext);
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <div className="mx-4 sm:mx-[10%]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/doctors"
              element={<PrivateRoute element={<Doctors />} />}
            />
            <Route
              path="/doctors/:speciality"
              element={<PrivateRoute element={<Doctors />} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/my-profile"
              element={<PrivateRoute element={<MyProfile />} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/my-appointments"
              element={<PrivateRoute element={<MyAppointments />} />}
            />
            <Route
              path="/appointment/:docId"
              element={<PrivateRoute element={<Appointment />} />}
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;