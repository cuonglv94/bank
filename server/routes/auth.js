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
        signup_error: 'Tài khoản đã tồn tại.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, password: hashedPassword });
    await user.save();
    res.status(201).send();
  } catch (error) {
    console.log('err', error);
    res.status(400).send({
      signup_error: 'Có lỗi khi đăng nhập. Xin thực hiện lại sau.'
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
        sigin_error: 'Tài khoản/mật khẩu không đúng.'
      });
    }
    const token = await generateAuthToken(user);
    const newToken = new Token({ access_token: token, userid: user.id });
    await newToken.save();
    newUser = { ...user, token: token };
    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send({
      signin_error: 'Tài khoản/mật khẩu không đúng.'
    });
  }
});

Router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { userid, access_token } = req.user;
    await Token.findOneAndDelete({ access_token, userid })
    res.status(200).send();
  } catch (error) {
    res.status(400).send({
      logout_error: 'Có lỗi xảy ra khi đăng xuất.'
    });
  }
});

module.exports = Router;
