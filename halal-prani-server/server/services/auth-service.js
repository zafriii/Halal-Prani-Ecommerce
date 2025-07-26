const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const registerUser = async ({ username, email, phone, password }) => {
  const userExist = await User.findOne({ email });
  if (userExist) {
    const error = new Error("Email already exists");
    error.status = 400;
    throw error;
  }

  const usernameExist = await User.findOne({ username });
  if (usernameExist) {
    const error = new Error("Username taken");
    error.status = 400;
    throw error;
  }

  const userCreated = await User.create({ username, email, phone, password });

  return {
    message: "Registration successful",
    token: await userCreated.generateToken(),
    userId: userCreated._id.toString()
  };
};

const loginUser = async (email, password) => {
  const userExist = await User.findOne({ email });

  if (!userExist) {
    const error = new Error("Invalid Credentials");
    error.status = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, userExist.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = await userExist.generateToken();

  return {
    message: "Login successful",
    token: token,
    userId: userExist._id.toString()
  };
};


const editAccount = async ({ userId, email, username, password, confirmPassword }) => {
  if (password && password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (email) {
    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id.toString() !== user._id.toString()) {
      const error = new Error("Email already exists");
      error.status = 400;
      throw error;
    }
    user.email = email;
  }

  if (username) {
    const usernameExist = await User.findOne({ username });
    if (usernameExist && usernameExist._id.toString() !== user._id.toString()) {
      throw new Error("Username taken");
    }
    user.username = username;
  }

  if (password) {
    user.password = password; 
  }

  await user.save();

  const token = jwt.sign({ userId: user._id.toString()}, process.env.JWT_SECRET_KEY, {
    expiresIn: '30d',
  });

  return {
    message: "Profile updated successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    token,
  };
};


module.exports = {
  registerUser,
  loginUser,
  editAccount

};
