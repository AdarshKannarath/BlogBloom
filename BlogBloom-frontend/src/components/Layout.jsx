import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
function Layout() {
    const location = useLocation();
    const params = useParams();
    console.log("Params in layout", params)
    // Check if the current route is '/login' or '/register'
    const isLoginOrRegister = ['/', '/login', '/register'].includes(location.pathname);
    const isProfile = location.pathname.startsWith('/profile');

    return (
        <main>
            {!isLoginOrRegister && !isProfile && <Header />}

            <Outlet />
        </main>
    );
}

export default Layout;
