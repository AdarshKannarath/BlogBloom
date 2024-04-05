import '../styles/LoginPage.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import theme from "../styles/MuiOverRide";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom"
import { useState, useContext, useEffect } from 'react';
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    // const { id } = userInfo;
    const [username, setUsername] = useState("")
    // const [password, setPassword] = useState("")
    console.log("username", username)
    // console.log('id at profile', id)
    const navigate = useNavigate();
    const [updated, setUpdated] = useState(false)

    const fetchUser = async () => {
        try {
            console.log('id at profile', userInfo.id)

            const res = await fetch(`http://localhost:3000/user/` + userInfo.id, {
                method: 'PUT',
                credentials: 'include',
            })
            if (!res.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const data = await res.json()
            console.log('Data', data)
            setUsername(userInfo.username)
            // setPassword(data.user.password)
            console.log("username", username)
            // console.log("password", password)
        } catch (error) {
            console.log('profile', error);

        }
    }

    const handleUpdateBtn = async () => {
        setUpdated(false)
        try {
            await fetch(`http://localhost:3000/user/` + userInfo.id, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ username }),

            })
            // alert("updated")
            setUsername(username)
            setUpdated(true)
        } catch (error) {
            console.log('Update', error);
            setUpdated(false)
        }

    }

    const handleDeleteBtn = async () => {
        try {
            await fetch(`http://localhost:3000/user/` + userInfo.id, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            navigate('/login')
            setUserInfo(null)

            console.log("User deleted")
        } catch (error) {
            console.log('Update', error);
        }
    }

    useEffect(() => {
        fetchUser()

    }, [userInfo.id])

    return (
        <Card style={{
            display: "flex", marginTop: '5rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
        }}>
            <div style={{ width: '100%' }}>
                <h1 className="blog-title">Profile</h1>
                <div>
                    <img src="..\src\assets\loginImg.jpg" alt="img" style={{ height: '25rem' }} />
                </div>
            </div>

            <div style={{ width: '70%', display: "flex", justifyContent: "center", alignItems: "center" }}>
                <form className="login" style={{ marginRight: '1rem' }}>
                    <ThemeProvider theme={theme}>
                        <TextField
                            type="text"
                            id="outlined-basic"
                            label="Username"
                            variant="outlined"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            style={{ marginBottom: '1rem' }}
                            fullWidth
                        />
                        {/* <TextField
                            type="password"
                            id="outlined-basic"
                            label="Password"
                            variant="outlined"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            style={{ marginBottom: '1rem' }}
                            fullWidth
                        /> */}
                    </ThemeProvider>
                    <Link><Button variant="contained" style={{ marginBottom: '1rem' }} onClick={handleUpdateBtn}>Update</Button></Link>
                    <Link><Button type='submit' variant="contained" onClick={handleDeleteBtn} >Delete</Button></Link>
                    {updated && <h3 style={{ color: '#4caf50', fontSize: '0.875rem', fontWeight: 'bold' }}>user updated successfully!</h3>}
                </form>
            </div>
        </Card>
    )
}
export default ProfilePage