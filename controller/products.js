const ObjectId = require("mongoose").Types.ObjectId;
const Products = require("../models/product");
const createError = require("http-errors");

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

const getProducts = async (req, res, next) => {
  // #swagger.description = 'Returns all products'
  try {
    const products = await Products.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {};

const addProducts = async (req, res, next) => {
  /*  
  // #swagger.description = 'Adds a new product'
  #swagger.parameters['product'] = {
                in: 'body',
                description: 'New product',
                schema: {
                    $name: 'Headset',
                    $description: 'a product',
                    $category: 'accessories',
                    $image: 'images/headset.png',
                    $price: 78,
                    shipping: 'free',
                    upvotes: 0,
                }
        } */
  const products = new Products({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    price: req.body.price,
    shipping: req.body.shipping,
    upvotes: req.body.upvotes,
  });

  try {
    const savedProducts = await products.save();
    res.json(savedProducts);
  } catch (error) {
    if (error.name === "ValidatorError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }
};

const updateProduct = async (req, res, next) => {};

const deleteProduct = async (req, res, next) => {};

module.exports = {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
