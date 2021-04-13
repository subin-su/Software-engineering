// for sign up
const User = require("../../Project-3/Models/userModel");
const UserSession = require("../Models/userSession");
const express = require("express");
const userSession = require("../Models/userSession");
const app = express();
module.exports = (app) => {
  app.post("/account/signup", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;
    if (!firstName) {
      return res.send({
        success: false,
        message: "First name cannot be blank",
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: "last name cannot be blank",
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "Email name cannot be blank",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Password cannot be blank",
      });
    }
    
    email = email.toLowerCase();

    User.find(
      {
        email: email,
      },
      (err, previousUsers) => {
        if (err) {
          return res.send("Email already in Use");
        } else if (previousUsers.length < 0) {
          return res.send("Account already exists");
        }
        const newUser = new User();
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
          if (err) {
            return res.send({
              message: "Email already in Use",
            });
          }
          return res.send({
            message: "Great You have Created an account with us!",
          });
        });
      }
    );
  });
  app.post("/account/signin", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;
    if (!email) {
      return res.send({
        success: false,
        message: "Email name cannot be blank",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Password cannot be blank",
      });
    }
    email = email.toLowerCase();

    User.find(
      {
        email: email,
        
      },
      (err, users) => {
        if (err) {
          return res.send({
            success: false,
            message: "err gdf",
          });
        }
        if (users.length != 1) {
          return res.send({
            success: true,
            message: "Email doesn't match",
          });
        }
        const user = users[0];
        if (!user.validPassword(password)) {
          return res.send({
            success: true,
            message: "error:email",
          });
        }
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
          if (err) {
            return res.send({
              success: false,
              message: "Password is invalid",
            });
          }
          return res.send(
            {
            
            success: true,
            message: "You have succefully Logged Out",
            token: doc._id,
          });
        });
      }
    );
  });
  app.get("/account/verify", (req, res, next) => {
    const { query } = req;
    const { token } = query;
    UserSession.find(
      {
        _id: token,
        isDeleted: false,
      },
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            message: "error",
          });
        }
        if (sessions.length != 1) {
          return res.send({
            success: false,
            message: "err",
          });
        } else {
          return res.send({
            success: true,
            message: "done",
          });
        }
      }
    );
  });

  app.get("/account/logout", (req, res, next) => {
    console.log("User Logout");
    const { query } = req;
    const { token } = query;
    userSession.findOneAndUpdate(
      {
        _id: token,
        isDeleted: false,
      },
      {},
      null,
      (err, sessions) => {
        {
          $set: {
            isDeleted: true;
          }
        }
        if (err) {
          return res.send({
            success: false,
            message: "error",
          });
        }

        return res.send({
          success: true,
          message: "done",
        });
      }
    );
  });
};
