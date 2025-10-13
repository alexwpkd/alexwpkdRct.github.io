import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from './App.jsx'

import "./assets/css/animate.css";
import "./assets/css/main.css";
import "./assets/css/responsive.css";

/*
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);


/*
import { StrictMode } from 'react' import { createRoot } from 'react-dom/client' import './index.css' import App from './App.jsx' // si usas bootstrap.css, impórtalo encima // import './styles/bootstrap.min.css' import { BrowserRouter } from 'react-router-dom' import './css/animate.css' import './css/main.css' import './css/responsive.css' createRoot(document.getElementById('root')).render( <BrowserRouter> <App /> </BrowserRouter> )
*/