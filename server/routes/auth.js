const express = require('express');
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Token = require("../models/Token");
const {
  validateUser,
  isInvalidField,
  generateAuthToken
} = require('../utils/common');
const authMiddleware = require('../middleware/auth');

const Router = express.Router();

Router.post('/signup', async (req, res) => {
  try {
    const { name, password } = req.body;
    const count = await User.countDocuments({ name });
    if (count > 0) {
      return res.status(400).send({
        signup_error: 'User with this email address already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, password: hashedPassword });
    await user.save();
    res.status(201).send();
  } catch (error) {
    console.log('err', error);
    res.status(400).send({
      signup_error: 'Error while signing up..Try again later.'
    });
  }
});

Router.post('/signin', async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await validateUser(name, password);
    console.log("signin user", user);
    if (!user) {
      res.status(400).send({
        sigin_error: 'Email/password does not match.'
      });
    }
    const token = await generateAuthToken(user);
    const newToken = new Token({ access_token: token, userid: user.id });
    await newToken.save();
    newUser = { ...user, token: token };
    res.send(newUser);
  } catch (error) {
    res.status(400).send({
      signin_error: 'Email/password does not match.'
    });
  }
});

Router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { userid, access_token } = req.user;
    await Token.findOneAndDelete({ access_token, userid })
    res.send();
  } catch (error) {
    res.status(400).send({
      logout_error: 'Error while logging out..Try again later.'
    });
  }
});

module.exports = Router;
