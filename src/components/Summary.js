import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import moment from 'moment';
import {
  initiateGetTransactions,
  downloadReport
} from '../actions/transactions';
import { initiateAddAccntDetails } from '../actions/account';
import Report from './Report';
import { maskNumber } from '../utils/mask';
import { resetErrors } from '../actions/errors';
import { useHistory } from 'react-router-dom';

const Summary = (props) => {
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const selectedType = history.location.pathname.substring(1, history.location.pathname.length)
  const processOnMount = useCallback(() => {
    return () => props.dispatch(resetErrors());
  }, [props]);

  useEffect(() => {
    processOnMount();
  }, [processOnMount]);

  useEffect(() => {
    setErrorMsg(props.errors);
  }, [props, props.errors]);

  useEffect(() => {
    setTransactions(props.transactions);
  }, [props, props.transactions]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setFormSubmitted(true);
    const convertedStartDate = moment(startDate).format('YYYY-MM-DD');
    const convertedEndDate = moment(endDate).format('YYYY-MM-DD');

    const { account } = props;
    props.dispatch(
      initiateGetTransactions(
        selectedType,
        convertedStartDate,
        convertedEndDate
      )
    );
  };

  const handleDownloadReport = (account_id, start_date, end_date) => {
    start_date = moment(start_date).format('YYYY-MM-DD');
    end_date = moment(end_date).format('YYYY-MM-DD');
    setIsDownloading(true);
    setErrorMsg('');
    props
      .dispatch(downloadReport(account_id, start_date, end_date))
      .then(() => setIsDownloading(false));
  };

  const handleAddAccount = (account) => {
    const { account_no, bank_name, ifsc } = account;
    props.dispatch(initiateAddAccntDetails(account_no, bank_name, ifsc));
  };

  const { account } = props;
  const account_no = account.account_no ? maskNumber(account.account_no) : '';

  return (
    <div className="summary-form">
      <p>{selectedType === "withdraw" ? "Lịch sử rút" : "Lịch sử nạp"}</p>
      {errorMsg && errorMsg.transactions_error && (
        <p className="errorMsg" style={{ maxWidth: 'unset' }}>
          {errorMsg.transactions_error}
        </p>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="bank_name">
          <Form.Label className="label">Từ ngày</Form.Label>
          <DatePicker
            selected={startDate}
            name="start_date"
            value={startDate}
            className="form-control datepicker"
            onChange={handleStartDateChange}
          />
        </Form.Group>
        <Form.Group controlId="bank_name">
          <Form.Label className="label">Đến ngày</Form.Label>
          <DatePicker
            selected={endDate}
            name="end_date"
            value={endDate}
            className="form-control"
            onChange={handleEndDateChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="btn-report">
          Tìm kiếm
        </Button>
      </Form>

      {transactions.length > 0 ? (
        <div className="transactions-section">
          {isDownloading ? (
            <p className="loading">Downloading...</p>
          ) : (
            <React.Fragment>
              <Button
                variant="primary"
                type="button"
                onClick={() =>
                  handleDownloadReport(account.account_id, startDate, endDate)
                }
              >
                Tải excel
              </Button>
              <h5>
                Detailed transactions between{' '}
                {moment(startDate).format('Do MMMM YYYY')} and{' '}
                {moment(endDate).format('Do MMMM YYYY')}
              </h5>
              <Report transactions={transactions} />
            </React.Fragment>
          )}
        </div>
      ) : (
        formSubmitted &&
        _.isEmpty(errorMsg) && (
          <p>No transactions found within selected date range.</p>
        )
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  transactions: state.transactions,
  errors: state.errors
});

export default connect(mapStateToProps)(Summary);
