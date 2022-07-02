import download from 'downloadjs';
import {
  BASE_API_URL,
  ADD_TRANSACTION,
  SET_TRANSACTIONS
} from '../utils/constants';
import { getErrors } from './errors';
import { updateAccountBalance } from './account';
import { get, post } from '../utils/api';


const randomString = (len, charSet) => {
  charSet = charSet || '0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export const addTransaction = (transaction) => ({
  type: ADD_TRANSACTION,
  transaction
});

export const initiateDepositAmount = (account_no, amount) => {
  const randomStr = randomString(6);
  return async (dispatch) => {
    try {
      const transaction = {
        action: 'deposit',
        amount,
        acc_from: account_no,
        description: "PAY" + randomStr,
      };
      await post(`${BASE_API_URL}/deposit/${account_no}`, transaction);
      dispatch(
        addTransaction({
          ...transaction
        })
      );
      // dispatch(updateAccountBalance(amount, 'deposit'));
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};

export const initiateWithdrawAmount = (account_no, amount, acc_to) => {
  const randomStr = randomString(6);
  return async (dispatch) => {
    try {
      const transaction = {
        action: 'withdraw',
        amount,
        acc_from: account_no,
        acc_to,
        description: "PAY" + randomStr,
      };
      await post(`${BASE_API_URL}/withdraw/${account_no}`, transaction);
      dispatch(
        addTransaction({
          ...transaction
        })
      );
      // dispatch(updateAccountBalance(amount, 'withdraw'));
    } catch (error) {
      console.log("er", error.response);
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};

export const setTransactions = (transactions) => ({
  type: SET_TRANSACTIONS,
  transactions
});

export const initiateGetTransactions = (selectedType, start_date, end_date) => {
  console.log('start_date', start_date);
  console.log('end_date', end_date);
  return async (dispatch) => {
    try {
      let query;
      if (start_date && end_date && start_date !== end_date) {
        query = `${BASE_API_URL}/transactions/${selectedType}?start_date=${start_date}&end_date=${end_date}`;
      } else {
        query = `${BASE_API_URL}/transactions/${selectedType}`;
      }
      const transactions = await get(query);
      dispatch(setTransactions(transactions.data));
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};

export const downloadReport = (account_id, start_date, end_date) => {
  return async (dispatch) => {
    try {
      const result = await get(
        `${BASE_API_URL}/download/${account_id}?start_date=${start_date}&end_date=${end_date}`,
        { responseType: 'blob' }
      );
      return download(result.data, 'transactions.pdf', 'application/pdf');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        dispatch(
          getErrors({
            transactions_error: 'Error while downloading..Try again later.'
          })
        );
      }
    }
  };
};
