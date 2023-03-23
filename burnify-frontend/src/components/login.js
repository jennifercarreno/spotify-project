import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {  useNavigate } from 'react-router-dom';
// async function loginUser(credentials) {
//     return fetch('http://localhost:3001/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(credentials)
//     })
//       .then(data => data.json())
//    }

function LoginPage({ setToken }) {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const navigate = useNavigate();

    // const handleSubmit = async e => {
    //     e.preventDefault();
    //     const token = await loginUser({
    //       username,
    //       password
    //     });
    //     setToken(token);
    //   }

    async function handleSubmit(e) {
		e.preventDefault()
		try {
			await axios.post("http://localhost:3001/login", {
				username, password
			})
                .then(function(response){

                    if (response.request.responseURL === "http://localhost:3001/home") {
                        navigate('/home');
                    } else {console.log(response.request.responseURL)}
                })
		} catch (error) {
			console.error(error)
		}
	}

    return (
        <div className="App">
            <h3>this is the login page</h3>
            <form onSubmit={handleSubmit}>
				<input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />

				<button type="submit">Send Name</button>
			</form>
        </div>
      );
}

LoginPage.propTypes = {
    setToken: PropTypes.func.isRequired
  };

export default LoginPage