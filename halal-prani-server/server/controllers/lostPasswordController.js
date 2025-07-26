const { sendResetLink, resetUserPassword } = require('../services/lostPasswordService');

const lostPassword = async (req, res) => {
  try {
    const response = await sendResetLink(req.body.email);
    return res.status(200).json({ message: response });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    const response = await resetUserPassword(resetToken, password);
    return res.status(200).json({ message: response });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  lostPassword,
  resetPassword,
};
