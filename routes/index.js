const routes = require("express").Router();
const express = require("express");
const createError = require("http-errors");
const productsRoute = require("./products");
const UsersRoute = require("./users");
const OrdersRoute = require("./orders");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const authRoute = require("./auth");
const path = require("path");

//express static
//routes.use(express.static(path.join(__dirname, "../views")));

//Home route
routes.get("/", (req, res) => {
  // #swagger.description = 'API home route'
  // const user = req.user ? req.user : {};
  // res.render("index", { user: user });

  res.json({
    name: "myecommerceapi",
    version: "1.0.0",
    description: "API for an ecommerce application",
    Author: "Ojo-Osasere Ayodeji Marcus",
  });
});

//auth
routes.use("/auth", authRoute);

//products route
routes.use("/products", productsRoute);

//users route
routes.use("/users", UsersRoute);

//api route
routes.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//404 error handler
routes.use((req, res, next) => {
  next(createError.NotFound("Not Found"));
});

//error handler
routes.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = routes;
