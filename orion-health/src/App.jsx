import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext"; // Admin context
import ThemeProvider from "./context/ThemeContext"; // Import ThemeProvider
import { UserContext } from "./context/UserContext";
import { AdminContext } from "./context/AdminContext"; // Admin context
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
import AdminLogin from "./pages/AdminLogin"; // Admin login page
import AdminDashboard from "./pages/AdminDashboard"; // Admin dashboard
import AdminManager from "./pages/AdminManager"; // Admin manager page
import AdminUsers from "./pages/AdminUsers"; // Admin users management
import AdminProfile from "./pages/AdminProfile"; // Admin profile page
import AppointmentManager from "./pages/AppointmentManager"; // Appointment manager page
import UserManager from "./pages/UserManager"; // User management page
import "./index.css";

// Private route for users
const PrivateRoute = ({ element }) => {
  const { user } = React.useContext(UserContext);
  return user ? element : <Navigate to="/login" />;
};

// Private route for admins
const PrivateAdminRoute = ({ element }) => {
  const { admin } = React.useContext(AdminContext);
  return admin ? element : <Navigate to="/admin/login" />;
};

const App = () => {
  return (
    <UserProvider>
      <AdminProvider>
        <ThemeProvider>
          <div className="mx-4 sm:mx-[10%]">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Private User Routes */}
              <Route
                path="/doctors"
                element={<PrivateRoute element={<Doctors />} />}
              />
              <Route
                path="/doctors/:speciality"
                element={<PrivateRoute element={<Doctors />} />}
              />
              <Route
                path="/my-profile"
                element={<PrivateRoute element={<MyProfile />} />}
              />
              <Route
                path="/my-appointments"
                element={<PrivateRoute element={<MyAppointments />} />}
              />
              <Route
                path="/appointment/:docId"
                element={<PrivateRoute element={<Appointment />} />}
              />

              {/* Private Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={<PrivateAdminRoute element={<AdminDashboard />} />}
              />
              <Route
                path="/admin-manager"
                element={<PrivateAdminRoute element={<AdminManager />} />}
              />
              <Route
                path="/admin/users"
                element={<PrivateAdminRoute element={<AdminUsers />} />}
              />
              <Route
                path="/appointment-manager"
                element={<PrivateAdminRoute element={<AppointmentManager />} />}
              />
              <Route
                path="/admin/profile"
                element={<PrivateAdminRoute element={<AdminProfile />} />}
              />
              <Route
                path="/user-manager"
                element={<PrivateAdminRoute element={<UserManager />} />}
              />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </ThemeProvider>
      </AdminProvider>
    </UserProvider>
  );
};

export default App;