import React, { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/navbar.css";

const Menu = () => {
  const location = useLocation();
  const shouldRenderNavbar = location.pathname !== "/tareas";
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
            <nav className={menuOpen ? "active" : ""}>
              <ul>
                <li>
                  <Link to="/" className="active" onClick={closeMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/tareas" onClick={closeMenu}>
                    Tareas
                  </Link>
                </li>
                <li>
                  <Link to="/recursos" onClick={closeMenu}>
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={closeMenu}>
                    About
                  </Link>
                </li>
              </ul>
              <div className="login-signup">
                <Link to="/login" onClick={closeMenu}>Login</Link> or{" "}
                <Link to="/registro" onClick={closeMenu}>Signup</Link>
              </div>
            </nav>
          </div>
          <div className="header-right">
            <div className="login-signup">
              <Link to="/login" onClick={closeMenu}>Login</Link> or{" "}
              <Link to="/registro" onClick={closeMenu}>Signup</Link>
            </div>
            <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
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
