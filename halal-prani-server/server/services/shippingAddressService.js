const ShippingAddress = require('../models/shippingAddressModel');

const getShippingAddressByUserId = async (userId) => {
  return await ShippingAddress.findOne({ user: userId });
};

const saveOrUpdateShippingAddress = async (userId, addressData) => {
  const existing = await ShippingAddress.findOne({ user: userId });

  if (existing) {
    Object.assign(existing, addressData);
    return await existing.save();
  } else {
    const newAddress = new ShippingAddress({ user: userId, ...addressData });
    return await newAddress.save();
  }
};

module.exports = {
  getShippingAddressByUserId,
  saveOrUpdateShippingAddress,
};
