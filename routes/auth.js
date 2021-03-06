const routes = require("express").Router();
const passport = require("passport");
const {
  login,
  logout,
  google,
  googleRedirect,
  addUser,
} = require("../controller/auth");

routes.post("/login", login);
routes.get("/logout", logout);
routes.post("/signup", addUser);

routes.get("/success", (req, res, next) => {
  res.send("User successfully Logged In");
});

//auth with google
routes.get("/google", google);

routes.get("/google/redirect", passport.authenticate("google"), googleRedirect);

module.exports = routes;
