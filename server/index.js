const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const accountRoute = require('./routes/account');
const transactionRoute = require('./routes/transactions');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://admin:admin@mongo-payment.ubjycsi.mongodb.net/?retryWrites=true&w=majority");

app.use(express.json());
app.use(cors());
app.use(authRoute);
app.use(profileRoute);
app.use(accountRoute);
app.use(transactionRoute);
app.use("*", (req, res) => {
  res.json("Page not found.");
})

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
