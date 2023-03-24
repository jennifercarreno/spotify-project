// this is the main app page
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import HomePage from './components/home';
import Navbar from './components/navbar';
function App() {


  return (
    <div className="App">
      <Navbar />

      <h3>this is the "home" app page</h3>
      {/* <Link to="/loginpage"><Button>Login</Button></Link>{' '}
      <Link to="/signuppage"><Button>Sign Up</Button></Link>{' '} */}
      <HomePage />

    </div>
  );
}

export default App;
