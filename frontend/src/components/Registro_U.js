import React, { Fragment, useState } from "react";
import "../style/registro.css";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";
import "../style/google.css";

const backend = process.env.REACT_APP_BACKEND;

const Registro_U = ({setIsAuthenticated}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navegate = useNavigate();

  const clearFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handlesubmin = async (e) => {
    e.preventDefault();
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
    console.log(data);

    clearFields();
  };

    
    const handleLogin = async () => {
      try {
        const response = await fetch(`${backend}/get-google-auth-url`);
  
        if (response.status === 200){
          const data = await response.json();
          window.location.href = data.url;
  
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          navegate("/tareas");
  
        }
        
      } catch (error) {
        console.error('Error during login:', error);
      }
    };
  

  return (
    <Fragment>
      <Menu />
      <div id="login-box">
        <form onSubmit={handlesubmin}>
          <div className="left">
            <h1 className="title-R">Sign up</h1>
            <input
              className="input-R"
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              className="input-R"
              type="text"
              name="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              className="input-R"
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {/* <input
            className="input-R"
            type="password"
            name="password2"
            placeholder="Retype password"
          /> */}
            <input
              className="input-R"
              type="submit"
              name="signup_submit"
              defaultValue="Sign me up"
            />
          </div>
          <div className="right">
            <span className="loginwith">
              Sign in with
              <br />
              social network
            </span>
            <button className="gsi-material-button" onClick={handleLogin} >
              <div className="gsi-material-button-state" />
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{ display: "block" }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </div>
                <span className="gsi-material-button-contents">
                  Sign in with Google
                </span>
                <span style={{ display: "none" }}>Sign in with Google</span>
              </div>
            </button>
           
          </div>
          <div className="or">OR</div>
        </form>
      </div>
    </Fragment>
  );
};

export default Registro_U;
