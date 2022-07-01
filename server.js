const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const cors = require("cors");
const Routes = require("./routes");
const passportSetup = require("./config/passport-setup");
const cookieSession = require("cookie-session");
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config();

//init express and middlewares
const app = express();
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
const PORT = process.env.PORT || 3000;
//app.set("view engine", "ejs");
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["dijvioduvsdvndsijn"],
  })
);
//passport
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/", Routes);

//start server and db
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
    console.log(`Connected to DB and listening on ${PORT}`);
  }
});
