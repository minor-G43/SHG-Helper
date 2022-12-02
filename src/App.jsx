import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Current from "./components/User";
import Shg from "./components/Details";
import Register from "./components/Register";

import "./App.css";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/testcomp" element={<Current />} />
                    <Route path="/details" element={<Shg />}></Route>
                    <Route path="/register" element={< Register/>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
