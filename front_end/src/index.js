import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store'; // Imports the store you configured
import App from './App';
import './index.css';
// import './index.css'; // Uncomment this if you have global styles

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // The Provider makes the Redux store available to any component in your App
  <Provider store={store}>
    <App />
  </Provider>
);