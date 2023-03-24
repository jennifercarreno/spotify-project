// this is the main app page
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import HomePage from './components/home';
import Navbar from './components/navbar';
import "./App.css"
function App() {


  return (
    <div className="App, spotify-body">
      <Navbar />

      {/* <Link to="/loginpage"><Button>Login</Button></Link>{' '}
      <Link to="/signuppage"><Button>Sign Up</Button></Link>{' '} */}
      <HomePage />

    </div>
  );
}

export default App;
