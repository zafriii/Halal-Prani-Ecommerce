const contactService = require('../services/contactService');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const result = await contactService.createContactMessage({ name, email, message });

    res.status(201).json({ message: 'Message submitted successfully!', result });
  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(400).json({ message: error.message || 'Submission failed.' });
  }
};
