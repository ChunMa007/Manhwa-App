import React, { useState } from 'react'
import '../Css/Login.css'
import { Navigate, useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLoginSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })

            let data = {}
            try {
                data = await response.json()
            } catch(err) {
                console.error("Could not parse JSON", err)
            }

            if(response.ok && data.tokens){
                localStorage.setItem(REFRESH_TOKEN, data.tokens.refresh)
                localStorage.setItem(ACCESS_TOKEN, data.tokens.access)
                alert(data.message)
                navigate('/')
                
            } else {
                if(data.non_field_errors){
                    alert(data.non_field_errors[0])
                }
            }
        } catch(err) {
            console.error("Something went wrong: ", err)
        }

        setUsername("")
        setPassword("")
    }


    return (
        <div className='login-container'>
            <div className="login_form">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Login</h1>

                    <div className="input_box">
                        <label>Email</label>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="input_box">
                        <div className="password_title">
                            <label>Password</label>
                            <a href="#">Forgot Password?</a>
                        </div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">Log In</button>
                    <p className="sign_up">Don't have an account?
                        <a 
                            onClick={() => navigate('/signup')}
                        >Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    )
}
