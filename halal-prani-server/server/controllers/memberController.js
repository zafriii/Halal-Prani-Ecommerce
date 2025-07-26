const memberService = require('../services/memberService');

exports.createMember = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const userId = req.user.id;

    const member = await memberService.createMember(userId, name, phone, email);

    res.status(201).json({ message: 'Member created successfully', member });
  } catch (error) {
    res.status(500).json({ message: 'Error creating member', error: error.message });
  }
};

exports.getMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const member = await memberService.getMember(userId);

    if (!member) {
      return res.status(404).json({ message: 'No membership found for this user.' });
    }

    res.status(200).json({ member });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member data', error: error.message });
  }
};
