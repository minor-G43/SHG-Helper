import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import User from "./components/User";
// import Details from "./components/Details";
import Register from "./components/register";
import "./App.css";


function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/user-signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user" element={<User />} />
                    {/* <Route path="/details" element={<Details />}></Route> */}
                    <Route path="/admin-signup" element={<Register />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
