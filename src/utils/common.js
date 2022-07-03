import jwt_decode from 'jwt-decode';
import axios from 'axios';
import store from '../store/store';
import { signIn } from '../actions/auth';
import { history } from '../router/AppRouter';

export const validateFields = (fieldsToValidate) => {
  return fieldsToValidate.every((field) => Object.values(field)[0] !== '');
};

export const maintainSession = () => {
  const user_token = localStorage.getItem('user_token');
  if (user_token) {
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      history.push('/home');
    }
    const decoded = jwt_decode(user_token);
    console.log('decoded', decoded);
    updateStore(decoded);
  } else {
    history.push('/');
  }
};

export const updateStore = (user) => {
  const { name } = user;
  store.dispatch(
    signIn({
      name,
      token: localStorage.getItem('user_token')
    })
  );
};

export const setAuthHeader = () => {
  const token = localStorage.getItem('user_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const removeAuthHeader = () => {
  delete axios.defaults.headers.common['Authorization'];
};

export const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 2
})
