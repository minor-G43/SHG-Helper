import React from "react";
import { Link } from "react-router-dom";

import "../../App.css";

const Current = () => {
    return (
        <div className="User">
            <div className="container">
                <div className="links-home">
                    <Link
                        to="/user-signup"
                        style={{ fontWeight: "bold" }}
                        className="login-link"
                    >
                        Signup
                    </Link>
                    <Link
                        to="/user-login"
                        style={{ fontWeight: "bold" }}
                        className="login-link"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Current;
