const Product = require("../models/productModel");
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose');

const dataFilePath = path.join(__dirname, "../data/products.json");

const readProductsFromFile = () => {
  const rawData = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(rawData);
};


const getAllProducts = async (orderby, order) => {
  let sortField = {};
  const sortOrder = order === 'asc' ? 1 : -1;

  if (orderby === 'price') {
    return Product.aggregate([
      {
        $addFields: {
          priceNumber: {
            $toDouble: {
              $replaceAll: {
                input: "$price",
                find: ",",
                replacement: ""
              }
            }
          }
        }
      },
      {
        $sort: { priceNumber: sortOrder }
      }
    ]);
  }

  if (orderby === 'date') {
    sortField = { createdAt: sortOrder }; 
    return Product.find().sort(sortField);
  }

  return Product.find().sort({ createdAt: -1 }); 
};


const getProductById =  async (id) => {
  try {
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    throw new Error('Product not found');
  }
};


const getProductsByCategory = async (category) => {
  return Product.find({ category: category.toUpperCase() });
};

const getProductsByType = async (type) => {
  return Product.find({ type: type.toUpperCase() });
};

const getProductsByTag = async (tag) => {
  return Product.find({ tags: { $in: [tag] } });
};


const addMissingProducts = async () => {
  const products = readProductsFromFile();
  const maxProduct = await Product.findOne().sort({ id: -1 });
  let nextId = maxProduct ? maxProduct.id + 1 : 1;

  let addedCount = 0;
  let updatedCount = 0;

  for (let item of products) {
    const existing = await Product.findOne({ name: item.name });

    if (existing) {
      await Product.updateOne({ name: item.name }, { $set: { ...item } });
      updatedCount++;
      continue;
    }

    if (!item.id) {
      item.id = nextId++;
    }

    await Product.create(item);
    addedCount++;
  }

  return { addedCount, updatedCount };
};

const removeDeletedProducts = async () => {
  const products = readProductsFromFile();
  const jsonIds = products.map((p) => p.id);
  const dbProducts = await Product.find();

  let deletedCount = 0;
  for (let item of dbProducts) {
    if (!jsonIds.includes(item.id)) {
      await Product.deleteOne({ id: item.id });
      deletedCount++;
    }
  }

  return { deletedCount };
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByType,
  getProductsByTag,
  addMissingProducts,
  removeDeletedProducts,
};
