import React from "react";

import "./shared.css";
const Register = () => {
    return (
        <div className="contain">
            <div className="card">
                <h2>Registration</h2>
                <form className="form">
                    <input placeholder="Name"></input>
                    <input placeholder="Aadhar"></input>
                    <input placeholder="Address"></input>
                </form>
            </div>
        </div>
    );
};

export default Register;
