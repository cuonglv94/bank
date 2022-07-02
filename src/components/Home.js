import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const Home = () => {
    const [selectedType, setSelectedType] = useState('withdraw');
    const history = useHistory();
    const handleOnChange = (selectedType) => {
        setSelectedType(selectedType);
        history.push("/transaction", selectedType);
    };

    return (
        <div>
            <div className="home">
                <div className='balance'><h1>100.000.000 VNĐ</h1></div>
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

export default connect()(Home);
