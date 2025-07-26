const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user-model'); 


const sendResetLink = async (email) => {
  if (!email) throw { status: 400, message: "Please provide email" };

  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: "User not found, please register" };

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: true,
    auth: {
      user: process.env.MY_GMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_GMAIL,
    to: email,
    subject: "Password Reset Request",
    text: `Click on this link to reset your password: ${resetUrl}`
  };

  await transporter.sendMail(mailOptions);

  return "Password reset link sent successfully to your email";
};

const resetUserPassword = async (resetToken, password) => {
  if (!password) throw { status: 400, message: "Please provide password" };

  const decoded = jwt.verify(resetToken, process.env.JWT_SECRET_KEY);
  const user = await User.findOne({ email: decoded.email });

  if (!user) throw { status: 404, message: "User not found" };

  user.password = password; 
  await user.save();

  return "Password reset successfully";
};

module.exports = {
  sendResetLink,
  resetUserPassword,
};
