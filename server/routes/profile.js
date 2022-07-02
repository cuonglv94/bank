const express = require('express');
const authMiddleware = require('../middleware/auth');
const Router = express.Router();

Router.get('/profile', authMiddleware, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send({
      update_error: 'Error while getting profile data..Try again later.'
    });
  }
});

module.exports = Router;
