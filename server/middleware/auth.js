const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Token = require("../models/Token");

const authMiddleware = async function (req, res, next) {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const decoded = jwt.verify(token, process.env.secret);
    const userid = await Token.find({ userid: decoded.userid });
    const user = await User.find({ id: userid });
    console.log("user middle", user);
    if (user) {
      req.user = user[0];
      req.token = token;
      next();
    } else {
      throw new Error('Error while authentication');
    }
  } catch (error) {
    res.status(400).send({
      auth_error: 'Authentication failed.'
    });
  }
};

module.exports = authMiddleware;
