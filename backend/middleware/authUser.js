import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Expecting 'Bearer <token>'
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized. Please log in again.' });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id; // Attach user ID to the request object
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }
};

export default authUser;