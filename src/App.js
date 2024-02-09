import './App.css';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import ChangePassword from "./pages/ChangePassword";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import { AuthContext } from './helpers/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  let navigate = useNavigate();

  const [authState, setAuthState] = useState(
    {
      username: "",
      id: 0,
      status: false
    });

  useEffect(() => {
    axios.get('http://localhost:3001/auth/', {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
      }
    }).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      }
      else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    })
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false
    });
    navigate("/login");
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
          <div className='navbar'>
            <div className='links'>
              {!authState.status ? (
                <>
                  <Link to="/login"> Login </Link>
                  <Link to="/registration"> Registration </Link>
                </>
              ) :
                (
                  <>
                    <Link to="/"> Home Page </Link>
                    <Link to="/createpost"> Create A Post </Link>
                    <div className='loggedInContainer'>
                      <p>{authState.username}</p>
                      <button className="logout" onClick={logout}>Logout</button>
                    </div>
                  </>
                )}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
      </AuthContext.Provider>

    </div>
  );
}

export default App;
