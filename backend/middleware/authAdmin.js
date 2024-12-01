import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    // Extract Bearer token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Missing or invalid Authorization header." });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token using the admin-specific secret
    jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
        }
        return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
      }

      // Check if the role is admin
      if (decoded.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied: Admins only." });
      }

      req.adminId = decoded.id; // Attach admin ID to the request
      req.decoded = decoded; // Optionally attach the full decoded token
      next();
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export default authAdmin;