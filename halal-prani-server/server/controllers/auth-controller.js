const { registerUser, loginUser, editAccount } = require("../services/auth-service");
const cartService = require("../services/cartService");
const Joi = require('joi');

const register = async (req, res, next) => {
  try {
    const schema = Joi.object({
      username: Joi.string().min(3).required().messages({
        "string.min": "Username must be at least 3 characters long",
        "any.required": "Username is required"
      }),
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required"
      }),
      phone: Joi.string().pattern(/^\d{10,15}$/).required().messages({
        "string.pattern.base": "Phone number must contain only digits and be between 10 and 15 digits",
        "any.required": "Phone number is required"
      }),
      password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required"
      }),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        "any.only": "Passwords do not match",
        "any.required": "Confirm password is required"
      })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }

    const result = await registerUser(req.body); 

    const guestId = req.cookies?.guestId;
    if (guestId) {
      await cartService.mergeCarts(result.user._id, guestId);
    }
    return res.status(201).json({
      message: "Registration successful",
      token: result.token,
      user: result.user,
    });

  } catch (error) {
    console.log("Error in register Page", error);
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const guestId = req.cookies?.guestId;

    const result = await loginUser(email, password); 

    if (guestId) {
      await cartService.mergeCarts(result.user._id, guestId);
    }

    return res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user
    });

  } catch (error) {
    console.log("Error in login Page", error);
    return res.status(error.status || 500).json({ message: error.message || "Server Error" });
  }
};



const user = async (req, res) => {
  try {
    const userData = req.user;
    return res.status(200).json({ userData });
  } catch (error) {
    console.log('User Error', error);
    return res.status(500).json({ message: "Server Error" });
  }
};


const editAccountController = async (req, res) => {
  try {
  
    const { email, username, password, confirmPassword } = req.body;

     const userId = req.user._id || req.userId;

    const result = await editAccount({ userId, email, username, password, confirmPassword });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updating profile", error);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ message: error.message || "Server Error" });
  }
};






module.exports = { register, login, user, editAccountController };
