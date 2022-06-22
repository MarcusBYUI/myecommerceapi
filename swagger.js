const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My Ecommerce API",
    description: "This is the api docummentation for my ecommerce api",
  },
  host: "radiant-gorge-19536.herokuapp.com",
  schemes: ["https"],
};

const outputFile = "./routes/swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
