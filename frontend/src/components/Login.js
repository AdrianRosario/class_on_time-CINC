import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../style/login.css";

import Menu from "./Menu";

const backend = process.env.REACT_APP_BACKEND;

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navegate = useNavigate();

  const handlesubmin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${backend}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // const data = await res.json();
    // console.log(data);

    if (res.status === 200) {
      const data = await res.json();
      const token = data.access_token;
      localStorage.setItem("jwt_token", token);

      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      navegate("/tareas");

    } else {
      console.error("Error de inicio de sesion");
    }

  };

  return (
    <Fragment>
      <Menu />
      <div className="overlay">
        <form onSubmit={handlesubmin} className="form-login">
          <div className="con">
            <header className="form-head">
              <h2>Log In</h2>
              <p>login here using your username and password</p>
            </header>
            <br />
            <div className="field-set">
              <span className="input-item">
                <i className="fa fa-user-circle" />
              </span>
              <input
                className="form-input"
                id="txt-input"
                type="text"
                placeholder="@UserName"
                required=""
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <br />
              <span className="input-item">
                <i className="fa fa-key" />
              </span>

              <input
                className="form-input"
                type="password"
                placeholder="Password"
                id="pwd"
                name="password"
                required=""
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              <br />
              <button className="log-in"> Log In </button>
            </div>
            <div className="other">
              <Link to="/resetpassword">
               
                <button className="btn-submits-l ">Forgot Password?</button>
              </Link>
              {/* <button className="btn-submits-l ">Forgot Password?</button> */}
              <Link to="/registro">
                <button className="btn-submits">
                  Sign Up
                  <i className="fa fa-user-plus" aria-hidden="true" />
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};
export default Login;
