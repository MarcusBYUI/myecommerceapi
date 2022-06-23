const mongoose = require("mongoose");
const Products = require("../models/product");
const createError = require("http-errors");
const Joi = require("joi");

const getProducts = async (req, res, next) => {
  // #swagger.description = 'Returns all products'
  try {
    const products = await Products.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const post = await Products.findById(req.params.id);

    if (!post) {
      next(createError(422, "Product does not exist"));
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid product ID"));
      return;
    }
    next(error);
  }
};

const addProduct = async (req, res, next) => {
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
    res.json(savedProducts._id);
  } catch (error) {
    if (error.name === "ValidatorError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
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
  const document = {};
  const keys = [
    "name",
    "description",
    "category",
    "image",
    "price",
    "shipping",
    "upvotes",
  ];

  //get the values from body
  for (const key in req.body) {
    if (typeof req.body[key] !== "undefined" && keys.includes(key)) {
      document[key] = req.body[key];
    }
  }

  // check the number of items sent for update
  if (Object.keys(document).length < 1) {
    next(createError(422, "Please provide information to be updated"));
    return;
  }

  const schema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    image: Joi.string().pattern(new RegExp("images/[a-zA-Z0-9]+.png")),
    price: Joi.number(),
    shipping: Joi.string(),
    upvotes: Joi.number(),
  });

  try {
    const value = await schema.validateAsync(document);

    const updateResult = await Products.updateOne(
      {
        _id: req.params.id,
      },
      { $set: value }
    );
    updateResult.modifiedCount > 0
      ? res
          .status(200)
          .send(`Product with Id ${req.params.id} was updated succesfully`)
      : res.status(200).send(`No update was made`);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid product ID"));
      return;
    }
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await Products.deleteOne({
      _id: req.params.id,
    });

    if (result.deletedCount < 1) {
      next(createError(422, "Product does not exist"));
      return;
    }

    res
      .status(200)
      .send(`Product with Id ${req.params.id} was deleted succesfully`);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid product ID"));
      return;
    }
    next(error);
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
