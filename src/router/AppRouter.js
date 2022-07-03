import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createBrowserHistory } from 'history';
import { Route, Switch, Router } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Home from '../components/Home';
import Header from '../components/Header';
import Logout from '../components/Logout';
import Account from '../components/Account';
import Transaction from '../components/Transaction';
import Summary from '../components/Summary';

export const history = createBrowserHistory();

const AppRouter = ({ auth }) => {
  return (
    <Router history={history}>
      <div>
        {!_.isEmpty(auth.token) && <Header />}
        <div className="container">
          <Switch>
            <Route path="/" component={Login} exact={true} />
            <Route path="/home" component={Home} />
            <Route path="/logout" component={Logout} />
            <Route path="/transaction" component={Transaction} />
            <Route path="/withdraw" component={Summary} />
            <Route path="/deposit" component={Summary} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AppRouter);
