const routes = require("express").Router();
const {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controller/products");

routes.get("/", getProducts);

// routes.get("/:id", getProductById);

//post
routes.post("/", addProducts);

//put

// routes.put("/:id", updateProduct);

// //del

// routes.delete("/:id", deleteProduct);

module.exports = routes;
