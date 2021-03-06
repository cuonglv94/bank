import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { formatter, validateFields } from '../utils/common';
import CurrencyInput from 'react-currency-input-field';
import {
    initiateGetAccntDetails
} from '../actions/account';
import { initiateWithdrawAmount, initiateDepositAmount } from '../actions/transactions';
import { resetErrors } from '../actions/errors';
import { connect } from 'react-redux';

const Transaction = (props) => {
    const history = useHistory();
    const selectedAction = history.location.state;
    const [account, setAccount] = useState();
    const [bankName, setBankName] = useState();
    const [state, setState] = useState({
        amount: '',
        acc_to: '',
        name_to: '',
        description: '',
    });
    const bankArr = ["VIETCOMBANK", "VIETTINBANK", "AGRIBANK", "TP BANK"];
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { errors } = props;
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        props.dispatch(initiateGetAccntDetails());
    }, []);

    useEffect(() => {
        setAccount(props.account);
    }, [props, props.account]);

    useEffect(() => {
        setErrorMsg(props.errors);
    }, [props, props.errors]);

    useEffect(() => {
        const randomStr = randomString(6);
        setState({
            ...state,
            ["description"]: "PAY" + randomStr
        });
    }, [selectedAction]);

    const handleCurrencyInput = (value, name) => {
        console.log('name', name);
        console.log('value', value);
        setState({
            ...state,
            [name]: value
        });
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    };


    const handleWithdraw = (event) => {
        event.preventDefault();

        const { amount, acc_to, bank_name_to, name_to, description } = state;
        if (isNaN(amount)) {
            setErrorMsg({ withdraw_error: 'Vui l??ng ??i???n ????ng ?????nh d???ng s??? ti???n.' });
        } else {
            if (amount === "" || acc_to === "" || name_to === "") {
                setErrorMsg({ withdraw_error: 'Vui l??ng ??i???n ?????y ????? th??ng tin.' });
            } else {
                props.dispatch(resetErrors());
                props.dispatch(initiateWithdrawAmount(account.account_no, amount * 0.9925, acc_to, description));
                handleShow();
            }
        }
    };

    const handleDeposit = (event) => {
        event.preventDefault();
        const { amount, description } = state;
        if (amount === "") {
            setErrorMsg({ deposit_error: 'Vui l??ng ??i???n ?????y ????? th??ng tin.' });
        } else {
            props.dispatch(resetErrors());
            props.dispatch(initiateDepositAmount(account.account_no, amount * 0.9925, description));
            handleShow();
        }
    };

    const handleChange = (event) => {
        setBankName(event.target.value);
    };
    const gotoWithdraw = (event) => {
        setShow(false);
    };

    const randomString = (len, charSet) => {
        charSet = charSet || '0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    return account ? (
        selectedAction === "withdraw" ? (
            <div className="edit-account-form  col-md-6 offset-md-3">
                <Form onSubmit={handleWithdraw} className="account-form">
                    {errorMsg && errorMsg.withdraw_error && (
                        <p className="errorMsg centered-message">{errorMsg.withdraw_error}</p>
                    )}
                    <Form.Group controlId="type">
                        <Form.Label>R??t ti???n</Form.Label>
                    </Form.Group>
                    <hr />
                    <Form.Group controlId="total_balance">
                        <Form.Label>S??? d??:</Form.Label>
                        <span className="label-stk">{formatter.format(account.total_balance)}</span>
                    </Form.Group>
                    <Form.Group controlId="amount">
                        <Form.Label>S??? ti???n r??t:</Form.Label>
                        <Form.Control
                            as="input"
                            type="number"
                            name="amount"
                            hidden
                            placeholder=""
                            value={state.amount}
                            onChange={handleInputChange}
                        />
                        <CurrencyInput
                            id="amount"
                            name="amount"
                            suffix="  ??"
                            decimalSeparator=","
                            groupSeparator="."
                            decimalsLimit={2}
                            onValueChange={(name, value) => handleCurrencyInput(name, value)}
                        />
                    </Form.Group>
                    <div><span className="label-fee">FEE: 0.75%</span></div>
                    <Form.Group controlId="bank_name">
                        <Form.Label>Nh???n ???????c:</Form.Label>
                        <span className="label-stk">{!isNaN(state.amount) ? formatter.format(state.amount * 0.9925) : ""}</span>
                    </Form.Group>
                    <Form.Group controlId="bank_name">
                        <Form.Label>T??n ng??n h??ng:</Form.Label>
                        <select onChange={handleChange}>
                            {
                                bankArr.map(arr => {
                                    return (<option key={arr}>{arr}</option>)
                                })
                            }
                        </select>
                    </Form.Group>
                    <Form.Group controlId="amount">
                        <Form.Label>S??? t??i kho???n nh???n:</Form.Label>
                        <Form.Control
                            type="number"
                            name="acc_to"
                            placeholder=""
                            value={state.acc_to}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="name_to">
                        <Form.Label>T??n ng?????i nh???n:</Form.Label>
                        <Form.Control
                            type="text"
                            name="name_to"
                            placeholder=""
                            value={state.name_to}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Ti???p theo
                    </Button>
                </Form>
                <Modal
                    show={show}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            R??t ti???n
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h2>L???nh r??t ???? ???????c g???i ??i!</h2>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button onClick={handleClose}>Ti???p theo</Button> */}
                        <Link to="/withdraw" className="link" onClick={() => gotoWithdraw()}>
                            <Button>Ti???p theo</Button>
                        </Link>
                    </Modal.Footer>
                </Modal>
            </div>
        ) : (
            <div className="edit-account-form  col-md-6 offset-md-3">
                <Form onSubmit={handleDeposit} className="account-form">
                    {errorMsg && errorMsg.deposit_error && (
                        <p className="errorMsg centered-message">{errorMsg.deposit_error}</p>
                    )}
                    <Form.Group controlId="type">
                        <Form.Label>N???p ti???n</Form.Label>
                    </Form.Group>
                    <hr />
                    <Form.Group controlId="bank_name">
                        <Form.Label>T??n ng??n h??ng:</Form.Label>
                        <span className="label-stk">{account.bank_name}</span>
                    </Form.Group>
                    <Form.Group controlId="accnt_no">
                        <Form.Label>S??? t??i kho???n:</Form.Label>
                        <span className="label-stk">{account.account_no}</span>
                    </Form.Group>
                    <Form.Group controlId="accnt_no">
                        <Form.Label>T??n t??i kho???n:</Form.Label>
                        <span className="label-stk">{account.account_name}</span>
                    </Form.Group>
                    <Form.Group controlId="amount">
                        <Form.Label>S??? ti???n n???p:</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            hidden
                            placeholder=""
                            value={state.amount}
                            onChange={handleInputChange}
                        />
                        <CurrencyInput
                            id="amount"
                            name="amount"
                            suffix="  ??"
                            decimalsLimit={2}
                            decimalSeparator=","
                            groupSeparator="."
                            onValueChange={(name, value) => handleCurrencyInput(name, value)}
                        />
                    </Form.Group>
                    <div><span className="label-fee">FEE: 0.75%</span></div>
                    <Form.Group controlId="bank_name">
                        <Form.Label>Nh???n ???????c:</Form.Label>
                        <span className="label-stk">{formatter.format(state.amount * 0.9925)}</span>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Ti???p theo
                    </Button>
                </Form>
                <Modal
                    show={show}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            N???p ti???n
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Ng??n h??ng:    {account.bank_name}</p>
                        <div className='stk'>
                            <p>S??? t??i kho???n:     {account.account_no}</p>
                            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(account.account_no)} >COPY</Button>
                        </div>
                        <p>T??n:  {account.account_name}</p>
                        <div className='stk'>
                            <p>{state.description}</p>
                            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(state.description)}>COPY</Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Link to="/deposit" className="link" onClick={() => gotoWithdraw()}>
                            <Button>Ti???p theo</Button>
                        </Link>
                    </Modal.Footer>

                </Modal>
            </div>
        )
    ) : (
        <></>
    );
};

const mapStateToProps = (state) => ({
    account: state.account,
    errors: state.errors
});

export default connect(mapStateToProps)(Transaction);;
