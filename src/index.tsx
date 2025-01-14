import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// react toastify
import 'react-toastify/dist/ReactToastify.css';
//redux
import { Provider } from 'react-redux';
import { moneymind } from 'redux/config';
//
import setupAxiosClient from 'axiosClient/setupClientInterceptors';
import setupAxiosFormData from 'axiosClient/setupFormDataInterceptors';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <Provider store={moneymind}>
    <App />
  </Provider>
  // </React.StrictMode>
);

setupAxiosClient(moneymind);
setupAxiosFormData(moneymind);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
