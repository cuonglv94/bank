import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import AccountForm from './AccountForm';

const Account = () => {
  const [selectedType, setSelectedType] = useState('withdraw');

  const handleOnChange = (selectedType) => {
    setSelectedType(selectedType);
  };

  return (
    <div>
      <div className="account">
        <AccountForm selectedType={selectedType} />
      </div>
    </div>
  );
};

export default connect()(Account);
