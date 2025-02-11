import React, { Fragment, useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import "../style/navbar.css";
import img from "../Icons/41da3NERJ4L.png";

const Menu = () => {
  const location = useLocation();
  const shouldRenderNavbar = location.pathname !== "/tareas";
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <Fragment>
      {shouldRenderNavbar && (
        <header>
          <div className="header-left">
            <div className="logo">
            <img src={img} alt="Logo" className="logo-img" />
              <NavLink to="/" className="log">
              
                <h1 >
                  Class <br />
                  &nbsp; &nbsp; &nbsp; &nbsp; On
                  <br />
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Time
                </h1>
              </NavLink>
            </div>
            <nav className={click ? "nav-menu active" : "nav-menu"}>
              <ul>
                <li>
                  <NavLink to="/" className="active" onClick={handleClick}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/espaciodetrabajo"
                    className="active"
                    onClick={handleClick}
                  >
                    Tareas
                  </NavLink>
                </li>
                <li>
                  <Link to="#" className="active" onClick={handleClick}>
                    Recursos
                  </Link>
                </li>
                <li>
                  <NavLink
                    to="#"
                    
                    onClick={handleClick}
                  >
                    About
                  </NavLink>
                </li>
              </ul>
              <div className="login-signup">
                <NavLink to="/login" onClick={handleClick}>
                  Login
                </NavLink>{" "}
                or{" "}
                <NavLink to="/registro" onClick={handleClick}>
                  Signup
                </NavLink>
              </div>
            </nav>
          </div>
          <div className="header-right">
            <div className="login-signup">
              <NavLink to="/login" onClick={handleClick}>
                Login
              </NavLink>{" "}
              or{" "}
              <NavLink to="/registro" onClick={handleClick}>
                Signup
              </NavLink>
            </div>
            <div className="hamburger" onClick={handleClick}>
              {click ? (
                <span className="material-symbols-outlined">close</span>
              ) : (
                <span className="material-symbols-outlined">menu</span>
              )}
            </div>
          </div>
        </header>
      )}
    </Fragment>
  );
};


export default Menu;
