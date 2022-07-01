const passport = require("passport");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");

const login = async (req, res, next) => {
  /*  
  // #swagger.description = 'Login a User'
  #swagger.parameters['User'] = {
                in: 'body',
                description: 'Login User',
                schema: {
                    
                    $email: 'accessories@gmail.com',
                    $password: 'test1245?',
                }
        }
        #swagger.responses[200] = {
            description: 'User successfully Logged In'}
        #swagger.responses[422] = {
            description: 'Kindly check the provided data'}
            

        */
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);

    const user = await User.findOne({ email: value.email });

    if (!user) {
      next(createError.UnprocessableEntity("User Not FOund"));
    }

    bcrypt.compare(value.password, user.password, function (err, result) {
      if (err) {
        next(error);
        return;
      }
      if (result) {
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.send("User successfully Logged In");
        });
      } else {
        next(createError.UnprocessableEntity("Password does not match"));
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  // #swagger.description = 'Logout a User'

  req.logout();
  res.send("Logout Succeful");
};

const google = passport.authenticate("google", {
  scope: ["profile"],
});

const googleRedirect = async (req, res, next) => {
  res.send("logged in");
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
            description: 'User successfully Logged In'}
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
        req.login(savedUser, function (err) {
          if (err) {
            return next(err);
          }
          return res.send("User successfully Logged In");
        });
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

module.exports = { login, google, googleRedirect, addUser, logout };
