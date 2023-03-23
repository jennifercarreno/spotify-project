// this is the main app page
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import {Link } from "react-router-dom";
import HomePage from './components/home';
import LoginPage from './components/login';
function App() {
  const [token, setToken] = useState("");

  if(!token) {
    return <LoginPage setToken={setToken} />
  }

  return (
    <div className="App">
      <h3>this is the "home" app page</h3>
      <Link to="/loginpage"><Button>Login</Button></Link>{' '}
      <Link to="/signuppage"><Button>Sign Up</Button></Link>{' '}
      <HomePage token={token} />

    </div>
  );
}

export default App;
