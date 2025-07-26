const ContactMessage = require('../models/contactModel');

exports.createContactMessage = async ({ name, email, message }) => {
  if (!name || !email || !message) {
    throw new Error('All fields are required');
  }

  const newMessage = new ContactMessage({ name, email, message });
  return await newMessage.save();
};
