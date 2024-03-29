import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import '../styles/LoginPage.css';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";

function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const { username, id } = userInfo;
    console.log("userId", id)
    console.log("userInfo", userInfo)

    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/me', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logoutBtn() {
        fetch('http://localhost:3000/logout', {
            credentials: "include",
            method: 'POST'
        });
        setUserInfo(null);
    }

    return (
        <header>
            <Link to="/posts" className="blog-title" style={{ fontWeight: 'bold', fontSize: '30px', marginTop: ".5rem" }}>BlogBloom</Link>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="search">
                <div style={{ marginRight: '.5rem' }}>
                    <BsSearch className="searchIcon" onClick={() => navigate(search ? "?search=" + search : navigate('/posts'))} />
                </div>
                <input onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search by post" style={{ outline: '2px solid transparent', boxShadow: 'none', backgroundColor: "white" }} />
            </div>

            <nav>
                {username ? (
                    <div>
                        <Link to={'/create'} style={{ marginRight: '1rem', fontSize: '20px' }}>Write</Link>
                        <Link to={'/login'} onClick={logoutBtn} style={{ fontSize: '20px', cursor: 'pointer' }}>Logout</Link>
                        <Link to={"/profile/" + id} style={{ fontSize: '20px', marginLeft: '1rem' }}>Profile</Link>
                    </div>
                ) : (
                    <div>
                            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;
