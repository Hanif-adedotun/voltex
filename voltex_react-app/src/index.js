import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Footer from './components/Footer/footer';
import * as serviceWorker from './serviceWorker';


// Index Page of the App

// Main Page of the App
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Footer Page of the App
ReactDOM.render(
  <React.StrictMode>
    <Footer />
  </React.StrictMode>,
  document.getElementById('footer')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
