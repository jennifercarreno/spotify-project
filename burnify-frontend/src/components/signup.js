import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useState } from 'react';

function SignupPage() {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    async function postName(e) {
		e.preventDefault()
		try {
			await axios.post("http://localhost:3001/login", {
				username, password
			})
		} catch (error) {
			console.error(error)
		}
	}

    return (
        <div className="App">
            <h3>This is the Sign up Page</h3>
            <form onSubmit={postName}>
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />

				<button type="submit">Send Name</button>
			</form>
        </div>
      );
}

export default SignupPage