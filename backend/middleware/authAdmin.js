import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.status(401).json({ success: false, message: 'Not Authorized' });
    }

    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);
    const isValid = tokenDecode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

    if (!isValid) {
      return res.status(403).json({ success: false, message: 'Invalid Token' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authAdmin;