import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

const Header = () => {
  const history = useHistory();
  const [selectedType, setSelectedType] = useState('');
  const handleOnChange = (selected) => {
    console.log("asdhashdasd");
    setSelectedType(selected);
    history.push("/" + selectedType, selectedType);
  };
  return (
    <header>
      {/* <h1>Xin chào</h1> */}
      <div className="links">
        <Link to="/home" className="link">
          Trang chủ
        </Link>
        <Link to="/account" className="link" >
          Tài khoản
        </Link>
        <Link to="/deposit" className="link" onClick={() => handleOnChange('deposit')}>
          Lịch sử nạp
        </Link>
        <Link to="/withdraw" className="link" onClick={() => handleOnChange('withdraw')}>
          Lịch sử rút
        </Link>
        <Link to="/logout" className="link">
          Đăng xuất
        </Link>
      </div>
    </header >
  );
};

export default connect()(Header);
