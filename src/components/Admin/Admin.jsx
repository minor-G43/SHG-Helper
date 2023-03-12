import React from "react";
import { Link } from "react-router-dom";

import "../../App.css";

const Current = () => {
    return (
        <div className="User">
            <div className="container">
                <div className="links-home">
                    <Link
                        to="/admin-signup"
                        style={{ fontWeight: "bold" }}
                        className="login-link"
                    >
                        Signup
                    </Link>
                    <Link
                        to="/admin-login"
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
