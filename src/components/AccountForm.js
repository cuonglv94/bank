import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  initiateGetAccntDetails,
  initiateAddAccntDetails,
} from '../actions/account';
// import { resetErrors } from '../actions/errors';
import { validateFields } from '../utils/common';
// import { maskNumber } from '../utils/mask';

const AccountForm = (props) => {
  const [account, setAccount] = useState(props.account);
  const [addAccount, setAddAccount] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [state, setState] = useState({
    account_no: '',
    bank_name: '',
  });

  console.log("account=------", props.account);
  const array = account ? Object.entries(account).map(e => e[1]) : [];
  console.log("array=------", array);
  useEffect(() => {
    props.dispatch(initiateGetAccntDetails());
  }, []);

  useEffect(() => {
    setAccount(props.account);
  }, [props, props.account]);

  useEffect(() => {
    setErrorMsg(props.errors);
  }, [props, props.errors]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value
    });
  };

  const handleAddAccount = (event) => {
    event.preventDefault();
    const { account_no, bank_name } = state;
    const fieldsToValidate = [{ account_no, bank_name }];
    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({ add_error: 'Please enter all the fields.' });
    } else {
      props
        .dispatch(initiateAddAccntDetails(account_no, bank_name))
        .then(() => props.dispatch(initiateGetAccntDetails()));
    }
    setAddAccount(false);
  };

  const { selectedType } = props;
  // const type = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
  return !addAccount ? (
    <>
      <h3>
        Thông tin tài khoản
      </h3>
      <hr />
      <Form className='acc_form'>
        {errorMsg && errorMsg.update_error && (
          <p className="errorMsg">{errorMsg.update_error}</p>
        )}
        <Form.Group controlId="bank_name">
          <Form.Label>Ngân hàng:</Form.Label>
          <span className="label-value">{array.length > 0 && array[0].bank_name}</span>
        </Form.Group>
        <Form.Group controlId="accnt_no" className='account-form'>
          <Form.Label>Số tài khoản:</Form.Label>
          <span className="label-value">{array.length > 0 && array[0].account_no}</span>
        </Form.Group>
        <Form.Group controlId="balance">
          <Form.Label>Số dư:</Form.Label>
          <span className="label-value">{array.length > 0 && array[0].total_balance.numberDecimal}</span>
        </Form.Group>
        <Button variant="primary" onClick={() => setAddAccount(true)}>
          Thêm tài khoản
        </Button>
      </Form>
    </>
  ) : (
    <div className="edit-account-form  col-md-6 offset-md-3">
      <Form onSubmit={handleAddAccount} className="account-form">
        {errorMsg && errorMsg.add_error && (
          <p className="errorMsg centered-message">{errorMsg.add_error}</p>
        )}
        <Form.Group controlId="type">
          <Form.Label>Thêm tài khoản ngân hàng</Form.Label>
        </Form.Group>
        <hr />
        <Form.Group controlId="account_no">
          <Form.Label>Số tài khoản </Form.Label>
          <Form.Control
            type="text"
            name="account_no"
            placeholder=""
            value={state.account_no}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="bank_name">
          <Form.Label>Tên ngân hàng</Form.Label>
          <Form.Control
            type="text"
            name="bank_name"
            placeholder=""
            value={state.bank_name}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Thêm tài khoản
        </Button>
        <Button variant="secondary" onClick={() => setAddAccount(false)}>
          Quay lại
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  email: state.auth && state.auth.email,
  account: state.account,
  errors: state.errors
});

export default connect(mapStateToProps)(AccountForm);
