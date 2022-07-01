const mongoose = require("mongoose");
const User = require("../models/user");
const createError = require("http-errors");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getUserById = async (req, res, next) => {
  // #swagger.description = 'Returns user by ID'
  /*
            #swagger.responses[200] = {
            description: 'User successfully obtained'}
            #swagger.responses[422] = {
            description: 'Kindly check the provided Id'}

  
  */
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      next(createError(422, "user does not exist"));
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid user ID"));
      return;
    }
    next(error);
  }
};

const addUser = async (req, res, next) => {
  /*  
  // #swagger.description = 'Adds a new User'
  #swagger.parameters['User'] = {
                in: 'body',
                description: 'New User',
                schema: {
                    $firstname: 'New',
                    $lastname: 'User',
                    $email: 'accessories@gmail.com',
                    $password: 'test1245?',
                }
        }
        #swagger.responses[200] = {
            description: 'User successfully added'}
        #swagger.responses[422] = {
            description: 'Kindly check the provided data'}
            

        */

  const schema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);

    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(value.password, salt, async function (err, hash) {
        const user = new User({
          firstname: value.firstname,
          lastname: value.lastname,
          email: value.email,
          password: hash,
        });

        //DB insertion
        const savedUser = await user.save();
        res
          .status(200)
          .send(`User with Id ${savedUser._id} was added succesfully`);
      });
    });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }
};

module.exports = { getUserById, addUser };
