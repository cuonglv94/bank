import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { initiateLogin } from '../actions/auth';
import { resetErrors } from '../actions/errors';
import { validateFields } from '../utils/common';
import { Link } from 'react-router-dom';

const Login = (props) => {
  const [state, setState] = useState({
    name: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const processOnMount = useCallback(() => {
    return () => props.dispatch(resetErrors());
  }, [props]);

  useEffect(() => {
    processOnMount();
  }, [processOnMount]);

  useEffect(() => {
    setErrorMsg(props.errors);
  }, [props, props.errors]);

  const handleLogin = (event) => {
    event.preventDefault();
    const { name, password } = state;
    const fieldsToValidate = [{ name }, { password }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({
        signin_error: 'Please enter all the fields.'
      });
    } else {
      setErrorMsg({
        signin_error: ''
      });
      // login successful
      props.dispatch(initiateLogin(name, password));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value
    });
  };

  return (
    <div className="login-page">
      <h1>Banking Application</h1>
      <div className="login-form">
        <Form onSubmit={handleLogin}>
          {errorMsg && errorMsg.signin_error && (
            <p className="errorMsg centered-message">{errorMsg.signin_error}</p>
          )}
          <Form.Group controlId="name">
            <Form.Label>Tài khoản</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder=""
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder=""
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="action-items">
            <Button variant="primary" type="submit">
              Đăng nhập
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  errors: state.errors
});

export default connect(mapStateToProps)(Login);
