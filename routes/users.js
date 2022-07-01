const { getUserById, addUser } = require("../controller/users");

const routes = require("express").Router();

routes.get("/:id", getUserById);

routes.post("/", addUser);

module.exports = routes;
