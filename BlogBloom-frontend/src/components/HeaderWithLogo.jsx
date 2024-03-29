import { Link } from "react-router-dom";

function HeaderWithLogo() {
    return (
        <header>
            <Link to="/posts" className="blog-title" style={{ fontWeight: 'bold', fontSize: '30px', marginTop: ".5rem" }}>BlogBloom</Link>
        </header>
    )
}
export default HeaderWithLogo