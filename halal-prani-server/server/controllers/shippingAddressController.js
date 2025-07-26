const shippingService = require('../services/shippingAddressService');

const getShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = await shippingService.getShippingAddressByUserId(userId);

    if (!address) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    return res.json(address);
  } catch (error) {
    console.error("Error fetching shipping address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const saveOrUpdateShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      country,
      street,
      apartment,
      district,
      postcode
    } = req.body;

    const savedAddress = await shippingService.saveOrUpdateShippingAddress(userId, {
      name,
      country,
      street,
      apartment,
      district,
      postcode
    });

    return res.status(200).json({
      message: "Shipping address saved successfully",
      address: savedAddress
    });

  } catch (error) {
    console.error("Error saving shipping address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getShippingAddress,
  saveOrUpdateShippingAddress,
};
