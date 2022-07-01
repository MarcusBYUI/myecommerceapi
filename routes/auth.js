const routes = require("express").Router();
const passport = require("passport");
const { login, google, googleRedirect } = require("../controller/auth");

routes.get("/login", login);

//auth with google
routes.get("/google", google);

routes.get("/google/redirect", passport.authenticate("google"), googleRedirect);

module.exports = routes;
