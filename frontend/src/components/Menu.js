import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/navbar.css";

const Menu = () => {
  const location = useLocation();
  const shouldRenderNavbar = location.pathname !== "/tareas";
  return (
    <Fragment>
      {shouldRenderNavbar && (
        <header className="head-navbar">
          <div className="header-left">
            <div className="logo">
              <h1 className="logo">
                Class <br />
                &nbsp; &nbsp; &nbsp; &nbsp; On
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Time
              </h1>
            </div>
            <nav>
              <ul>
                <li>
                  <Link to="/" className="active">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/tareas" target="_blank" rel="noopener noreferrer">
                    Tareas
                  </Link>
                </li>
                <li>
                  <Link to="">Recursos</Link>
                </li>
                <li>
                  <Link to="/About">About</Link>
                </li>
              </ul>
              <div className="login-signup">
                <Link to="/login">Login</Link> or{" "}
                <Link to="/registro">Signup</Link>
              </div>
            </nav>
          </div>
          <div className="header-right">
            <div className="login-signup">
              <Link to="/login">Login</Link> or{" "}
              <Link to="/registro">Signup</Link>
            </div>
            <div className="hamburger">
              <div />
              <div />
              <div />
            </div>
          </div>
        </header>
      )}
      
    </Fragment>
  );
};
export default Menu;
