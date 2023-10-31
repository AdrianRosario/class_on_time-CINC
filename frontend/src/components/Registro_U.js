import React, { Fragment, useState } from "react";
import "../style/registro.css";
import google from "../asset/img/registro_g.png"
import Menu from "./Menu";



 const backend = process.env.REACT_APP_BACKEND;

const Registro_U = () => {

  const [username , setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };
  

  const handlesubmin = async (e) =>{
    e.preventDefault();
    const res = await fetch(`${backend}/register`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
    const data  = await res.json();
    console.log(data)

    clearFields();
  }

  return (
    
    <Fragment>
        <Menu/>
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
            <button className="google-sign">
              <img src={google} alt="" />
            </button>
          </div>
          <div className="or">OR</div>
        </form>
      </div>
    </Fragment>
  );
};

export default Registro_U;
