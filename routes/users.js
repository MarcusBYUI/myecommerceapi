const { getUserById, getUsers } = require("../controller/users");
const passport = require("passport");
const routes = require("express").Router();

const isAuth = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send("This is a protected resouce, log in to continue");
  }
};

routes.get("/", isAuth, getUsers);

routes.get("/:id", isAuth, getUserById);

module.exports = routes;
