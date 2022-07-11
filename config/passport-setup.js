const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/user");
const createError = require("http-errors");
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new googleStrategy(
    {
      //oauth details from google
      callbackURL: "/auth/google/redirect",
      clientID: process.env.clientID,
      clientSecret: process.env.clientSec,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ gid: profile.id });
        if (user) {
          done(null, user);
        } else {
          const doc = {
            firstname: profile.name.givenName,
            gid: profile.id,
          };
          const user = new User(doc);
          const savedUser = await user.save();
          done(null, savedUser);
        }
      } catch (error) {
        if (error.name == "ValidationError") {
          done(createError.UnprocessableEntity(error.message));
          return;
        }
        done(error);
      }
    }
  )
);
