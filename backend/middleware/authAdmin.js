import jwt from "jsonwebtoken";
import { promisify } from "util";

const verifyToken = promisify(jwt.verify);

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header is missing." });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Invalid Authorization header format." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token is missing in the Authorization header." });
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET_ADMIN);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admins only." });
    }

    req.adminId = decoded.id;
    req.decoded = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
    }

    console.error("Admin auth error:", error.message);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export default authAdmin;