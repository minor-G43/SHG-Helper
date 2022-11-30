import React from "react";

import "./shared.css";
const Shg = () => {
    return (
        <div className="contain">
            <div className="card">
                <form className="form">
                    <h3>SHG DETAILS</h3>
                    <input type={"text"} placeholder="SHGName"></input>
                    <input type={"text"} placeholder="UserName"></input>
                    <input type={"text"} placeholder="UserPassword"></input>
                </form>
            </div>
        </div>
    );
};

export default Shg;
