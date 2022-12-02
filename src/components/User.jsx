import React from "react";
import { Link } from "react-router-dom";

import "../App.css";

const Current = () => {
    return (
        <div className="User">
            <div className="container">
                <div className="links-home">
                    <Link
                        to="/details"
                        style={{ fontWeight: "bold" }}
                        className="login-link"
                    >
                        Current User
                    </Link>
                    <Link
                        to="/register"
                        style={{ fontWeight: "bold" }}
                        className="login-link"
                    >
                        New User
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Current;
