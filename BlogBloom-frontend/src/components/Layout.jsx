import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

function Layout() {
    const location = useLocation();

    // Check if the current route is '/login' or '/register'
    const isLoginOrRegister = ['/','/login', '/register'].includes(location.pathname);

    return (
        <main>
            {!isLoginOrRegister && <Header />}
            <Outlet />
        </main>
    );
}

export default Layout;
