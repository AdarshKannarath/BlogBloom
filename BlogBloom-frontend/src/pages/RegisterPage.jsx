import { useNavigate } from "react-router-dom";
import { useState } from "react"
import '../styles/LoginPage.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import theme from "../styles/MuiOverRide";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom"
function RegisterPage() {
    const [username,setUsername]=useState([])
    const [password,setPassword]=useState([])
    const navigate=useNavigate()

    async function registerBtn(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${window.location.origin}/register`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Registration failed:', errorMessage);
                return;
            }
            navigate('/')
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    return (
        <Card className="card-container" style={{ marginTop: '5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ width: '100%' }}>
                <h1 className="blog-title">BlogBloom</h1>
                <div>
                    <img src="src\assets\loginImg.jpg" alt="img" style={{ height: '100%' }} />
                </div>
            </div>

            <div style={{}} className="login-form">
                <form className="login" style={{}}>
                    <ThemeProvider theme={theme}>
                        <TextField
                            type="text"
                            id="outlined-basic"
                            label="Username"
                            variant="outlined"
                            style={{ marginBottom: '1rem' }}
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            type="password"
                            id="outlined-basic"
                            label="Password"
                            variant="outlined"
                            style={{ marginBottom: '1rem' }}
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </ThemeProvider>
                    <Link><Button variant="contained" onClick={registerBtn}>Register</Button></Link>
                </form>
            </div>
        </Card>
    )
}
export default RegisterPage