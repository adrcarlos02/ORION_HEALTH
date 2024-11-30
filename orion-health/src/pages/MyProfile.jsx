import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext.jsx";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // Ensure correct path

const MyProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null); // Holds the selected image file
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
    },
    gender: "Not Selected",
    dob: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          line1: (user.address && user.address.line1) || "",
          line2: (user.address && user.address.line2) || "",
        },
        gender: user.gender || "Not Selected",
        dob: user.dob || "",
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "line1" || name === "line2") {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle profile update
  const updateUserProfileData = async () => {
    try {
      // Basic validation
      if (!formData.name.trim()) {
        toast.error("Name is required.");
        return;
      }
      if (!formData.phone.trim()) {
        toast.error("Phone number is required.");
        return;
      }

      setLoading(true); // Start loading

      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("address", JSON.stringify(formData.address)); // Stringify the address
      dataToSend.append("gender", formData.gender);
      dataToSend.append("dob", formData.dob);
      if (image) {
        dataToSend.append("image", image);
      }

      const { data } = await axios.put("/api/user/profile", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" }, // Optional: Browsers set this automatically with correct boundaries
      });

      if (data.success) {
        toast.success(data.message || "Profile updated successfully.");
        setUser(data.user); // Update user in context with the updated user
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false); // End loading
    }
  };

  if (!user) return <p className="text-center" style={{ color: "var(--text-color)" }}>Loading...</p>; // Ensure user data is loaded

  return (
    <div
      className="max-w-lg flex flex-col gap-2 text-sm pt-5 mx-auto"
      style={{ color: "var(--text-color)", backgroundColor: "var(--bg-color)" }}
    >
      {/* Profile Image */}
      {isEdit ? (
        <label htmlFor="image" className="cursor-pointer">
          <div className="inline-block relative">
            <img
              className="w-36 h-36 rounded-full object-cover opacity-75"
              src={image ? URL.createObjectURL(image) : user.image}
              alt="Profile"
            />
            <div
              className="absolute bottom-0 right-0 rounded-full p-1"
              style={{ backgroundColor: "var(--bg-color)" }}
            >
              <img
                className="w-6 h-6"
                src={assets.upload_icon} // Ensure you have an upload icon in your assets
                alt="Upload Icon"
              />
            </div>
          </div>
          <input onChange={handleImageChange} type="file" id="image" hidden accept="image/*" />
        </label>
      ) : (
        <img className="w-36 h-36 rounded-full object-cover" src={user.image} alt="Profile" />
      )}

      {/* Name */}
      {isEdit ? (
        <input
          className="text-3xl font-medium max-w-60 p-2 rounded"
          style={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
            borderColor: "var(--primary-color)",
          }}
          type="text"
          name="name"
          onChange={handleChange}
          value={formData.name}
          placeholder="Your Name"
        />
      ) : (
        <p className="font-medium text-3xl mt-4">{user.name}</p>
      )}

      <hr className="border-none h-[1px]" style={{ backgroundColor: "var(--primary-color)" }} />

      {/* Contact Information */}
      <div>
        <p className="underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3">
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{user.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="max-w-52 p-1 rounded"
              style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
              type="text"
              name="phone"
              onChange={handleChange}
              value={formData.phone}
              placeholder="Phone Number"
            />
          ) : (
            <p className="text-blue-500">{user.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div>
              <input
                className="p-1 rounded mb-1"
                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
                type="text"
                name="line1"
                onChange={handleChange}
                value={formData.address.line1}
                placeholder="Address Line 1"
              />
              <input
                className="p-1 rounded"
                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
                type="text"
                name="line2"
                onChange={handleChange}
                value={formData.address.line2}
                placeholder="Address Line 2"
              />
            </div>
          ) : (
            <p>
              {user.address?.line1 || "N/A"} <br /> {user.address?.line2 || "N/A"}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className="underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 p-1 rounded"
              style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
              name="gender"
              onChange={handleChange}
              value={formData.gender}
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer Not to Say">Prefer Not to Say</option>
            </select>
          ) : (
            <p>{user.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-28 p-1 rounded"
              style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
              type="date"
              name="dob"
              onChange={handleChange}
              value={formData.dob}
            />
          ) : (
            <p>{user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}</p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="px-8 py-3 rounded-full text-white transition-all"
            style={{
              borderColor: "var(--primary-color)",
              backgroundColor: "var(--primary-color)",
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Information"}
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-8 py-3 rounded-full text-white transition-all"
            style={{
              borderColor: "var(--primary-color)",
              backgroundColor: "var(--primary-color)",
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;