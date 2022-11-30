import React from "react";
import { Link } from "react-router-dom";

import "./shared.css";

const Current = () => {
    return (
        <div className="contain">
            <form className="form">
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
            </form>
        </div>
    );
};

export default Current;
