import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { registerNewUser } from '../actions/auth';
import { resetErrors } from '../actions/errors';
import { validateFields } from '../utils/common';
import { Link } from 'react-router-dom';

const Register = (props) => {
  const [state, setState] = useState({
    name: '',
    password: '',
    cpassword: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const processOnMount = useCallback(() => {
    return () => props.dispatch(resetErrors());
  }, [props]);

  useEffect(() => {
    processOnMount();
  }, [processOnMount]);

  useEffect(() => {
    setErrorMsg(props.errors);
  }, [props, props.errors]);

  const registerUser = (event) => {
    event.preventDefault();
    const { name, password, cpassword } = state;

    const fieldsToValidate = [
      { name },
      { password },
      { cpassword }
    ];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({
        signup_error: 'Vui lòng nhập tất cả các trường.'
      });
    } else {
      if (password !== cpassword) {
        setErrorMsg({
          signup_error: 'Mật khẩu không giống nhau.'
        });
      } else {
        setIsSubmitted(true);
        props
          .dispatch(registerNewUser({ name, password }))
          .then((response) => {
            if (response.success) {
              setSuccessMsg('Bạn đã đăng ký tài khoản thành công.');
              setErrorMsg('');
            }
          });
      }
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
      <h2>Đăng ký</h2>
      <div className="login-form">
        <Form onSubmit={registerUser}>
          {errorMsg && errorMsg.signup_error ? (
            <p className="errorMsg centered-message">{errorMsg.signup_error}</p>
          ) : (
            isSubmitted && (
              <p className="successMsg centered-message">{successMsg}</p>
            )
          )}
          <Form.Group controlId="name">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={state.name}
              placeholder=""
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={state.password}
              placeholder=""
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="cpassword">
            <Form.Label>Nhập lại mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="cpassword"
              value={state.cpassword}
              placeholder=""
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="action-items">
            <Button variant="primary" type="submit">
              Register
            </Button>
            <Link to="/" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  errors: state.errors
});

export default connect(mapStateToProps)(Register);
