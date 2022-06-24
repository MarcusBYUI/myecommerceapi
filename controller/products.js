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
  // #swagger.description = 'Returns product by ID'
  /*
            #swagger.responses[200] = {
            description: 'Product successfully obtained'}
            #swagger.responses[422] = {
            description: 'Kindly check the provided Id'}

  
  */

  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      next(createError(422, "Product does not exist"));
      return;
    }
    res.status(200).json(product);
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
        }
        #swagger.responses[200] = {
            description: 'Product successfully added'}
        #swagger.responses[422] = {
            description: 'Kindly check the provided data'}
            

        */

  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    image: Joi.string()
      .pattern(new RegExp("images/[a-zA-Z0-9]+.png"))
      .required(),
    price: Joi.number().required(),
    shipping: Joi.string(),
    upvotes: Joi.number(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);

    const products = new Products({
      name: value.name,
      description: value.description,
      category: value.category,
      image: value.image,
      price: value.price,
      shipping: value.shipping,
      upvotes: value.upvotes,
    });

    //DB insertion
    const savedProducts = await products.save();
    res
      .status(200)
      .send(`Product with Id ${savedProducts._id} was added succesfully`);
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  /*  
  // #swagger.description = 'Update an existing product'
  #swagger.parameters['product'] = {
                in: 'body',
                description: 'Existing product',
                schema: {
                    name: 'Headset',
                    description: 'a product',
                    category: 'accessories',
                    image: 'images/headset.png',
                    price: 78,
                    shipping: 'free',
                    upvotes: 0,
                }
        }
        
            #swagger.responses[200] = {
            description: 'Product successfully Updated'}
            #swagger.responses[422] = {
            description: 'Kindly check the provided data'}

  
        
        */
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
    //validation
    const value = await schema.validateAsync(document);

    const updateResult = await Products.updateOne(
      {
        _id: req.params.id,
      },
      { $set: value }
    );

    return updateResult.modifiedCount > 0
      ? //if update went through
        res
          .status(200)
          .send(`Product with Id ${req.params.id} was updated succesfully`)
      : // if
      updateResult.matchedCount < 1
      ? //if product does not exist
        next(createError(422, "Product does not exist"))
      : // product exist but nothing was updated
        res.status(200).send(`No update was made`);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid product ID"));
      return;
    }
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  // #swagger.description = 'Delete an existing product'

  /*
              #swagger.responses[200] = {
            description: 'Product successfully Deleted'}
            #swagger.responses[422] = {
            description: 'Kindly check the provided Id'}
  
  */

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
