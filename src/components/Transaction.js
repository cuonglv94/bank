import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { validateFields } from '../utils/common';
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
    const [selectedAcc, setSelectedAcc] = useState({});
    const [state, setState] = useState({
        amount: '',
        acc_to: ''
    });
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { errors } = props;
    console.log("history", history.location);
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

    const array = account ? Object.entries(account).map(e => e[1]) : [];
    useEffect(() => {
        if (array.length > 0) {
            setSelectedAcc(array[0]);
        }
    }, [account]);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    };

    const handleWithdraw = (event) => {
        event.preventDefault();
        const { amount, acc_to } = state;
        if (amount === "" || acc_to === "") {
            setErrorMsg({ withdraw_error: 'Please enter all the fields.' });
        } else {
            props.dispatch(resetErrors());
            props.dispatch(initiateWithdrawAmount(selectedAcc.account_no, amount * 0.925, acc_to));
            handleShow();
        }
    };

    const handleDeposit = (event) => {
        event.preventDefault();
        const { amount } = state;
        if (amount === "") {
            setErrorMsg({ deposit_error: 'Please enter all the fields.' });
        } else {
            props.dispatch(resetErrors());
            props.dispatch(initiateDepositAmount(selectedAcc.account_no, amount * 0.925));
        }
        handleShow();
    };

    const handleChange = (event) => {
        const value = event.target.value.split(",");
        console.log("value", value);
        setSelectedAcc({ account_no: value[0], total_balance: value[1] });
    };

    return selectedAction === "withdraw" ? (
        <div className="edit-account-form  col-md-6 offset-md-3">
            <Form onSubmit={handleWithdraw} className="account-form">
                {errorMsg && errorMsg.withdraw_error && (
                    <p className="errorMsg centered-message">{errorMsg.withdraw_error}</p>
                )}
                <Form.Group controlId="type">
                    <Form.Label>Rút tiền</Form.Label>
                </Form.Group>
                <hr />
                <Form.Group controlId="bank_name">
                    <Form.Label>Tên ngân hàng:</Form.Label>
                    <select onChange={handleChange}>
                        {
                            array.length > 0 && array.map(arr => {
                                return (<option key={arr.account_no} value={arr.account_no + "," + arr.total_balance}>{arr.bank_name}</option>)
                            })
                        }
                    </select>
                </Form.Group>
                <Form.Group controlId="accnt_no">
                    <Form.Label>Số tài khoản:</Form.Label>
                    <span className="label-stk">{selectedAcc.account_no}</span>
                </Form.Group>
                <Form.Group controlId="total_balance">
                    <Form.Label>Số dư:</Form.Label>
                    <span className="label-stk">{selectedAcc.total_balance}</span>
                </Form.Group>
                <Form.Group controlId="amount">
                    <Form.Label>Số tiền rút:</Form.Label>
                    <Form.Control
                        type="number"
                        name="amount"
                        placeholder=""
                        value={state.amount}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <div><span className="label-fee">0.75%</span></div>
                <Form.Group controlId="bank_name">
                    <Form.Label>Nhận được:</Form.Label>
                    <Form.Control
                        readOnly
                        type="text"
                        value={state.amount * 0.925}
                    />
                </Form.Group>
                <Form.Group controlId="amount">
                    <Form.Label>Tài khoản nhận:</Form.Label>
                    <Form.Control
                        type="number"
                        name="acc_to"
                        placeholder=""
                        value={state.acc_to}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Tiếp theo
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
                        Rút tiền
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2>Lệnh rút đã được gửi đi!</h2>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Tiếp theo</Button>
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
                    <Form.Label>Nạp tiền</Form.Label>
                </Form.Group>
                <hr />
                <Form.Group controlId="bank_name">
                    <Form.Label>Tên ngân hàng:</Form.Label>
                    <select onChange={handleChange}>
                        {
                            array.length > 0 && array.map(arr => {
                                return (<option key={arr.account_no} value={arr.account_no + "," + arr.total_balance}>{arr.bank_name}</option>)
                            })
                        }
                    </select>
                </Form.Group>
                <Form.Group controlId="accnt_no">
                    <Form.Label>Số tài khoản:</Form.Label>
                    <span className="label-stk">{selectedAcc.account_no}</span>
                </Form.Group>
                {/* <Form.Group controlId="total_balance">
                    <Form.Label>Số dư:</Form.Label>
                    <span className="label-stk">{selectedAcc.total_balance}</span>
                </Form.Group> */}
                <Form.Group controlId="amount">
                    <Form.Label>Số tiền nạp:</Form.Label>
                    <Form.Control
                        type="number"
                        name="amount"
                        placeholder=""
                        value={state.amount}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <div><span className="label-fee">0.75%</span></div>
                <Form.Group controlId="bank_name">
                    <Form.Label>Nhận được:</Form.Label>
                    <Form.Control
                        readOnly
                        type="text"
                        value={state.amount * 0.925}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Tiếp theo
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
                        Nạp tiền
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Ngân hàng:    VIETCOMBANK</p>
                    <div className='stk'>
                        <p>Số tài khoản:     89796756</p>
                        <Button>COPY</Button>
                    </div>
                    <p>Tên:  Nguyễn Văn A</p>
                    <div className='stk'>
                        <p>Nội dung:     PAY987879</p>
                        <Button>COPY</Button>
                    </div>
                    <p>LOADING...     15:00:00</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Tiếp theo</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    account: state.account,
    errors: state.errors
});

export default connect(mapStateToProps)(Transaction);;
