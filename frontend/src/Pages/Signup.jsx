import { useState } from 'react'
import '../Css/Signup.css'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const navigate = useNavigate()

    const handleSignupSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, password2 })
            })

            let data = {}
            try {
                data = await response.json()
            } catch(err) {
                console.error("Could not parse JSON: ", err)
            }

            if(response.ok) {
                setUsername("")
                setEmail("")
                setPassword("")
                setPassword2("")
                navigate('/login')
                alert(data.message)
            } else {
                if(data.non_field_errors) {
                    alert(data?.non_field_errors?.[0])
                } else if(data.email) {
                    alert(data?.email?.[0])
                } else {
                    alert("Signup Unsuccessful")
                }
            }
        } catch(err) {
            console.error("Something went wrong: ", err.message || err)
        }
    }

    return (
    <div className='login-container'>
        <div className="login_form">
            <form onSubmit={handleSignupSubmit}>
                <h1>Signup</h1>

                <div className="input_box">
                    <label>Username</label>
                    <input 
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username" 
                        
                    />
                </div>

                <div className="input_box">
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input_box">
                    <label>Password</label>
                    <input 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input_box">
                    <label>Confirm Password</label>
                    <input 
                        type="password"
                        placeholder="Confirm passowrd"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Register</button>
                <p className="sign_up">Already have an account? 
                    <a 
                        onClick={() => navigate('/login')}
                    >
                    Login</a>
                </p>
            </form>
        </div>
    </div>
    )
}
