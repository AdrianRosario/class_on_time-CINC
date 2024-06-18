import React, { Fragment, useState } from "react";
import "../style/registro.css";
import Menu from "./Menu";
import { NavLink, useNavigate } from "react-router-dom";
import "../style/google.css";

const backend = process.env.REACT_APP_BACKEND;

const Registro_U = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navegate = useNavigate();
  const [message, setMessage] = useState("");

  const clearFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handlesubmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backend}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const data = await res.json();
      setMessage(data.msg); // Actualiza el estado con el mensaje devuelto por el backend
      clearFields();
    } catch (error) {
      console.error("Error:", error);
    }

    // const res = await fetch(`${backend}/register`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username,
    //     email,
    //     password,
    //   }),
    // });
    // const data = await res.json();
    // console.log(data);

    // clearFields();
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${backend}/get-google-auth-url`);

      if (response.status === 200) {
        const data = await response.json();
        window.location.href = data.url;

        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        navegate("/hometaks");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Fragment>
      <Menu />
      <div id="login-box">
        <div className="form-container">
          <p className="title">Create account</p>
          <p className="sub-title">
            Let's get statred with your 30 days free trial
          </p>
          <form className="form" onSubmit={handlesubmin}>
            <input
              type="text"
              className="input"
              name="username"
              placeholder="Username"
              required
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              type="email"
              className="input"
              name="email"
              placeholder="E-mail"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              className="input"
              name="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button className="form-btn">Create account</button>
          </form>
          <p className="sign-up-label">
            Already have an account?<NavLink to="/login"><span className="sign-up-link">Log in</span></NavLink>
          </p>
          
          <div className="buttons-container">
            <div className="google-login-button">
              <svg
                stroke="currentColor"
                fill="currentColor"
                
                strokeWidth={0}
                version="1.1"
                x="0px"
                y="0px"
                className="google-icon"
                viewBox="0 0 48 48"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              <span onClick={handleLogin} >Sign up with Google</span>
            </div>
          </div>
          
        </div>
        
      </div>
      <p>{message}</p>
    </Fragment>
  );
};

export default Registro_U;
