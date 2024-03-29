import { useState, useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../contexts/userContext"
import '../styles/LoginPage.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import theme from "../styles/MuiOverRide";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom"

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const { setUserInfo } = useContext(UserContext)

    async function handleLoginBtn(e) {
        e.preventDefault()
        const response = await fetch(`${window.location.origin}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
                setRedirect(true)
            })

        } else {
            alert("Wrong credentails")
        }
    }
    if (redirect) {
        return <Navigate to={'/posts'} />
    }
    return (
        <Card className="card-container" style={{ marginTop: '5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ width: '100%' }}>
                <h1 className="blog-title">BlogBloom</h1>
                <div>
                    <img src="src\assets\loginImg.jpg" alt="img" style={{ height: '100%' }} />
                </div>
            </div>

            <div className="login-form" style={{}}>
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
                    <Button variant="contained" onClick={handleLoginBtn}>Login</Button>
                    <div>
                        <p style={{ justifyContent: "center", paddingLeft: '3rem' }} >
                            Don`t have an account?
                            <Link to={'/register'} style={{ textDecoration: 'none' }}><span style={{ marginLeft: '.5rem', cursor: 'pointer', color: '#152238', fontWeight: 'bold' }}>Register here</span></Link>
                        </p>
                    </div>
                </form>
            </div>
        </Card>

    )
}
export default LoginPage