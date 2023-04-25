import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import UserSignup from "./components/User/UserSignup";
import UserLogin from "./components/User/UserLogin";
import AdminLogin from './components/Admin/AdminLogin'
import User from "./components/User/User";
import Details from "./components/Details";
import AdminSignup from "./components/Admin/AdminSignup";
import Main from "./components/Main";
import Admin from './components/Admin/Admin'
import Requests from "./components/Admin/Requests";
import Chat from "./components/Chat";
import "./App.css";


function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/user-signup" element={<UserSignup />} />
                    <Route path="/user-login" element={<UserLogin />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/details" element={<Details />}></Route>
                    <Route path="/admin-signup" element={<AdminSignup />}></Route>
                    <Route path="/shg-list" element={<Main />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
