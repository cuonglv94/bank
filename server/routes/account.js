const express = require('express');
const authMiddleware = require('../middleware/auth');
const { pool } = require('../db/connect');
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const Router = express.Router();

const getAccountByAccountId = async function (account_id) {
  try {
    const result = await pool.query(
      'select * from account a inner join bank_user b on a.userid = b.userid where a.account_id=$1',
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return null;
  }
};

// async function getAccount() {
//   try {
//     const result = await Transaction.find();
//     // delete result.rows[0].password;
//     return result;
//   } catch (error) {
//     return null;
//   }
// }

// get account details by email
Router.get('/account', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const result = await Account.findOne();
    if (result) {
      res.send({ account: result });
    } else {
      res.status(400).send({
        get_error: 'Account details does not exist.'
      });
    }
  } catch (error) {
    res.status(400).send({
      get_error: 'Error while getting account details..Try again later.'
    });
  }
});

Router.post('/account', authMiddleware, async (req, res) => {
  const user = req.user;
  const body = req.body;
  try {
    const account = new Account({ account_no: body.account_no, bank_name: body.bank_name, total_balance: '0', userid: user._id });
    console.log("account", account);
    await account.save();
    res.status(201).send(account);
  } catch (error) {
    res.send({
      add_error: 'Error while adding new account..Try again later.'
    });
  }
});

Router.patch('/account', authMiddleware, async (req, res) => {
  const { ifsc } = req.body;
  try {
    const result = await pool.query(
      'update account set ifsc=$1 where userid=$2 returning *',
      [ifsc, req.user.userid]
    );
    res.send({ account: result.rows[0] });
  } catch (error) {
    res.send({
      update_error: 'Error while updating account..Try again later.'
    });
  }
});
module.exports = Router;
// module.exports = { Router, getAccountByAccountId };
