import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    // Extract Bearer token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized." });
    }

    // Verify the token using the admin-specific secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    // Check if the role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admins only." });
    }

    req.adminId = decoded.id; // Attach admin ID to the request
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export default authAdmin;