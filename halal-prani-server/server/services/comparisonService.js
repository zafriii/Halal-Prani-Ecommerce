const Comparison = require('../models/comparisonModel');

exports.addProductToComparison = async (userId, productData) => {
  let comparison = await Comparison.findOne({ userId });

  if (!comparison) {
    comparison = new Comparison({ userId, products: [productData] });
  } else {
    const alreadyExists = comparison.products.some(
      (p) => p.productId.toString() === productData.productId.toString()
    );
    if (!alreadyExists) {
      comparison.products.push(productData);
    }
  }

  await comparison.save();
  return comparison;
};

exports.getComparison = async (userId) => {
  return await Comparison.findOne({ userId });
};

exports.removeProductFromComparison = async (userId, productId) => {
  const comparison = await Comparison.findOne({ userId });

  if (!comparison) throw new Error("Comparison list not found");

  comparison.products = comparison.products.filter(
    (p) => p.productId.toString() !== productId.toString()
  );

  await comparison.save();
  return comparison;
};