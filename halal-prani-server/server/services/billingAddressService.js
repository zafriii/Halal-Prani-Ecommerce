const BillingAddress = require('../models/billingAddressModel');

const saveOrUpdateAddress = async (userId, addressData) => {
  let billingAddress = await BillingAddress.findOne({ userId });

  if (billingAddress) {
    billingAddress = await BillingAddress.findOneAndUpdate(
      { userId },
      { ...addressData },
      { new: true }
    );
  } else {
    billingAddress = await BillingAddress.create({ userId, ...addressData });
  }

  return billingAddress;
};

const getAddress = async (userId) => {
  return await BillingAddress.findOne({ userId });
};

module.exports = {
  saveOrUpdateAddress,
  getAddress,
};
