
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const required = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized HTTP, token not provided" });
  }

  const jwtToken = token.replace("Bearer ", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const userData = await User.findById(isVerified.userId).select({ password: 0 });

    if (!userData) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = userData;
    req.token = token;
    req.userID = userData._id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

const optional = async (req, res, next) => {
  const token = req.header("Authorization");

  if (token && token.startsWith("Bearer ")) {
    const jwtToken = token.replace("Bearer ", "").trim();

    try {
      const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
      const userData = await User.findById(isVerified.userId).select({ password: 0 });

      if (userData) {
        req.user = userData;
        req.token = token;
        req.userID = userData._id;
      }
    } catch (error) {
      
    }
  }

  next(); 
};

module.exports = {
  required,
  optional,
};








