import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/CSS/App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// create the root element 
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();
