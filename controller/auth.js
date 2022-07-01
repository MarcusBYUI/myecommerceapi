const passport = require("passport");

const login = async (req, res, next) => {
  res.render("login/index");
};

const google = passport.authenticate("google", {
  scope: ["profile"],
});

const googleRedirect = async (req, res, next) => {
  res.send("logged in");
};

module.exports = { login, google, googleRedirect };
