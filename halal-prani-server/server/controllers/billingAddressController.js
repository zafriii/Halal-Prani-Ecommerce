const billingAddressService = require('../services/billingAddressService');

const saveOrUpdateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, email, address, country, postcode } = req.body;

    const billingAddress = await billingAddressService.saveOrUpdateAddress(userId, {
      name,
      phone,
      email,
      address,
      country,
      postcode,
    });

    res.status(200).json({ message: 'Billing address saved successfully', billingAddress });
  } catch (error) {
    console.error('Billing Save Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const billingAddress = await billingAddressService.getAddress(userId);

    if (!billingAddress) {
      return res.status(404).json({ message: 'Billing address not found' });
    }

    res.status(200).json(billingAddress);
  } catch (error) {
    console.error('Billing Get Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  saveOrUpdateAddress,
  getAddress,
};
