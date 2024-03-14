import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../contexts/userContext"
import '../styles/LoginPage.css';



function Header(){
    const {userInfo,setUserInfo}=useContext(UserContext)
    // const [username,setUsername]=useState(null)
    useEffect(()=>{
        fetch('http://localhost:3000/me',{
            credentials:'include',

        }).then(response=>{
            response.json().then(userInfo=>{
                // setUsername(userInfo.username)
                setUserInfo(userInfo)
            })
        })
    },[])


    function logoutBtn() {
        fetch('http://localhost:3000/logout',{
            credentials:"include",
            method:'POST'
        })
        setUserInfo(null)
    }

    const username=userInfo?.username

    return(
        <header>
            <Link to="/posts" className="blog-title" style={{fontWeight:'bold', fontSize:'30px'}}>BlogBloom</Link>
            <nav>
                {username &&(
                    <div>
                        <Link to={'/create'} style={{ marginRight: '1rem', fontSize: '20px' }}>Write</Link>
                        <Link to={'/login'}><a onClick={logoutBtn} style={{ fontSize: '20px' }}>Logout</a></Link>
                    </div>
                )}
                {!username &&(
                    <div>
                        <Link to="/login" style={{marginRight:'1rem'}}>Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )}    
            </nav>
        </header>
    )
}
export default Header