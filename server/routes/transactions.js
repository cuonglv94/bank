const path = require('path');
const fs = require('fs');
const express = require('express');
const moment = require('moment');
const ejs = require('ejs');
const func = require('./account');
const authMiddleware = require('../middleware/auth');
const { getTransactions, generatePDF } = require('../utils/common');
const { getClient } = require('../db/connect');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Router = express.Router();

Router.post('/deposit/:id', authMiddleware, async (req, res) => {
  try {
    const { action, amount, acc_from, description } = req.body;
    const account = await Account.findOne({ account_no: acc_from });
    const total_balance = account.total_balance;
    const total = parseFloat(total_balance) + parseFloat(amount);

    const transaction = new Transaction({ action, amount, acc_from, description });
    transaction.save();
    await Account.findOneAndUpdate({ account_no: acc_from }, { total_balance: total })
    res.send();
  } catch (error) {
    res.status(400).send({
      deposit_error: 'Có lỗi khi nạp tiền. Xin thực hiện lại!'
    });
  }
});

Router.post('/withdraw/:id', authMiddleware, async (req, res) => {
  try {
    const { action, amount, acc_from, acc_to, bank_name_to, name_to, description } = req.body;
    const account = await Account.findOne({ account_no: acc_from });
    const total_balance = account.total_balance;
    const total = parseFloat(total_balance) - parseFloat(amount);
    if (amount <= total) {
      const transaction = new Transaction({ action, amount, acc_from, acc_to, bank_name_to, name_to, description });
      transaction.save();
      await Account.findOneAndUpdate({ account_no: acc_from }, { total_balance: total })
    } else {
      return res.status(400).send({
        withdraw_error: "Bạn không đủ số dư để rút tiền"
      });
    }
    res.send();
  } catch (error) {
    res.status(400).send({
      withdraw_error: 'Có lỗi khi rút tiền. Xin thực hiện lại sau.'
    });
  }
});

Router.get('/transactions/:id', authMiddleware, async (req, res) => {
  const { start_date, end_date } = req.query;
  try {
    const result = await getTransactions(req.params.id, start_date, end_date);
    res.send(result);
  } catch (error) {
    res.status(400).send({
      transactions_error:
        'Có lỗi khi kiểm tra giao dịch. Xin thực hiện lại sau.'
    });
  }
});

Router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const account_id = req.params.id;
    const result = await getTransactions(account_id, start_date, end_date);
    const basePath = path.join(__dirname, '..', 'views');
    const templatePath = path.join(basePath, 'transactions.ejs');
    const templateString = ejs.fileLoader(templatePath, 'utf-8');
    const template = ejs.compile(templateString, { filename: templatePath });
    const accountData = await func.getAccountByAccountId(account_id);
    accountData.account_no = accountData.account_no
      .slice(-4)
      .padStart(accountData.account_no.length, '*');
    const output = template({
      start_date: moment(start_date).format('Do MMMM YYYY'),
      end_date: moment(end_date).format('Do MMMM YYYY'),
      account: accountData,
      transactions: result.rows
    });
    fs.writeFileSync(
      path.join(basePath, 'transactions.html'),
      output,
      (error) => {
        if (error) {
          throw new Error();
        }
      }
    );
    const pdfSize = await generatePDF(basePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfSize
    });
    res.sendFile(path.join(basePath, 'transactions.pdf'));
  } catch (error) {
    res.status(400).send({
      transactions_error: 'Có lỗi khi tải file. Xin thực hiện lại sau.'
    });
  }
});

module.exports = Router;
