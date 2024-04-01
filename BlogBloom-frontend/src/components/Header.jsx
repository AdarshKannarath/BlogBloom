import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import '../styles/LoginPage.css';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";

function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const { username, id } = userInfo;

    const [search, setSearch] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${window.location.origin}/me`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logoutBtn() {
        fetch(`http://localhost:3000/logout`, {
            credentials: "include",
            method: 'POST'
        });
        setUserInfo(null);
    }

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/posts" className="blog-title">BlogBloom</Link>

                <div className='search-container'>
                    <p>
                        <BsSearch className="searchIcon" onClick={() => navigate(search ? "?search=" + search : navigate('/posts'))} />
                    </p>

                    <input onChange={(e) => setSearch(e.target.value)} className='outline-none px-3' placeholder='Search by post' type='text' />
                </div>
            </div>
            <Link to={'/create'} style={{ fontSize: 'large', marginLeft: '190px' }}>Write</Link>
            <div className="header-right">
                <div className="hamburger-menu" onClick={() => setShowMenu(!showMenu)}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                {showMenu && (
                    <div className="menu">
                        {username ? (
                            <div>

                                <Link to={"/profile/" + id} className="menu-item">Profile</Link>
                                <Link to={'/login'} onClick={logoutBtn} className="menu-item">Logout</Link>
                            </div>
                        ) : (
                            <div>
                                <Link to="/login" className="menu-item">Login</Link>
                                <Link to="/register" className="menu-item">Register</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
