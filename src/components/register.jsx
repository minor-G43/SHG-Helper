import React from "react";

import "./shared.css";
const Register = () => {
    return (
        <div className="contain">
            <div className="card">
                <h2>Registration</h2>
                <form className="form">
                    <input placeholder="SHG Name"></input>
                    <input placeholder="State"></input>
                    <input placeholder="District"></input>
                    <input placeholder="Panchayat Name"></input>
                    <input placeholder="Village Name"></input>
                    <input placeholder="Interest Rate"></input>
                </form>
                <div className="members">
                    <form className="mem_details">
                        <input placeholder="President" required></input>
                        <input placeholder="Treasurer" required></input>
                        <input placeholder="President" required></input>
                        <input placeholder="President" required></input>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
