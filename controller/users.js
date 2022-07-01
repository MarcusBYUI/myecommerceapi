const mongoose = require("mongoose");
const User = require("../models/user");
const createError = require("http-errors");

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

const getUsers = async (req, res, next) => {
  // #swagger.description = 'Returns all users'

  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById, getUsers };
