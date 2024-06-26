import './styles/App.css'
import './components/Post'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { UserContextProvider } from './contexts/userContext'
import CreatePost from './pages/CreatePost'
import PostPage from './pages/PostPage'
import UpdatePost from './pages/UpdatePost'
import ProfilePage from './pages/ProfilePage'
import Footer from './components/Footer'

function App() {
  const location = useLocation();

  // Define paths where footer should not display
  const hideFooterPaths = ['/', '/login', '/register'];

  // Function to check if the footer should be hidden
  const shouldHideFooter = () => {
    return hideFooterPaths.includes(location.pathname);
  };

  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<LoginPage />} />
          <Route path='/posts' element={<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='/edit/:id' element={<UpdatePost />} />
          <Route path='/profile/:id' element={<ProfilePage />} />
        </Route>
      </Routes>
      {!shouldHideFooter() && <Footer />}
    </UserContextProvider>
  )
}

export default App
