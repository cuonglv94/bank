import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { validateFields } from '../utils/common';

const AddAccountForm = (props) => {
  const [state, setState] = useState({
    account_no: '',
    bank_name: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

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
    const { amount } = state;
    const fieldsToValidate = [{ amount }];
    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({ add_error: 'Please enter all the fields.' });
    } else {
      props.handleAddAccount(state);
    }
  };

  return (
    <div className="edit-account-form  col-md-6 offset-md-3">
      <Form onSubmit={handleAddAccount} className="account-form">
        {errorMsg && errorMsg.add_error && (
          <p className="errorMsg centered-message">{errorMsg.add_error}</p>
        )}
        <Form.Group controlId="type">
          <Form.Label>Thêm tài khoản ngân hàng</Form.Label>
        </Form.Group>
        <hr />
        <Form.Group controlId="accnt_no">
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
            name="account_no"
            placeholder=""
            value={state.bank_name}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Thêm tài khoản
        </Button>
        <Button variant="secondary" type="submit">
          Quay lại
        </Button>
      </Form>
    </div>
  );
};

export default AddAccountForm;
