import { useNavigate } from "react-router-dom";
import { useState } from "react"
import '../styles/LoginPage.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import theme from "../styles/MuiOverRide";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
// import { Link } from "react-router-dom"

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [correctPw, setCorrectPw] = useState(true)
    const navigate = useNavigate();

    async function registerBtn(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setCorrectPw(false)
            console.error('Password and confirm password do not match');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/register`, {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
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
            navigate('/');
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    return (
        <Card className="card-container" style={{ marginTop: '5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ width: '83rem' }}>
                <h1 className="blog-title">BlogBloom</h1>
                <div>
                    <img src="src\assets\loginImg.jpg" alt="img" style={{ height: '27rem' }} />
                </div>
            </div>

            <div style={{}} className="login-form">
                <form className="login" type='submit' autoComplete="off">
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
                            type="email"
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            style={{ marginBottom: '1rem' }}
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <TextField
                            type="password"
                            id="outlined-basic"
                            label="Confirm Password"
                            variant="outlined"
                            style={{ marginBottom: '1rem' }}
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </ThemeProvider>
                    <Button type="submit" variant="contained" onClick={registerBtn}>Register</Button>
                    {!correctPw && <h3 style={{ color: 'red', fontSize: '0.875rem', marginTop: '5px', fontWeight: 'bold' }}>password did not match, try again</h3>}
                </form>
            </div>
        </Card>
    )
}

export default RegisterPage;
