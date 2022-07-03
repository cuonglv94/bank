import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import {
    initiateGetAccntDetails
} from '../actions/account';
import { useHistory } from 'react-router-dom';
import { formatter } from '../utils/common';

const Home = (props) => {
    const [selectedType, setSelectedType] = useState('withdraw');
    const [account, setAccount] = useState();
    const history = useHistory();
    const handleOnChange = (selectedType) => {
        setSelectedType(selectedType);
        history.push("/transaction", selectedType);
    };
    useEffect(() => {
        props.dispatch(initiateGetAccntDetails());
    }, []);

    useEffect(() => {
        setAccount(props.account);
    }, [props, props.account]);
    return (
        <div>
            <div className="home">
                <div className='balance'><h1>{account && formatter.format(account.total_balance)}</h1></div>
                <div className='home-btn'>
                    <Button
                        variant="primary"
                        className={`${selectedType === 'withdraw' ? 'active account-btn' : 'account-btn'
                            }`}
                        onClick={() => handleOnChange('withdraw')}
                    >
                        Rút tiền
                    </Button>
                    <Button
                        variant="secondary"
                        className={`${selectedType === 'deposit' ? 'active account-btn' : 'account-btn'
                            }`}
                        onClick={() => handleOnChange('deposit')}
                    >
                        Nạp tiền
                    </Button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    account: state.account,
});

export default connect(mapStateToProps)(Home);
