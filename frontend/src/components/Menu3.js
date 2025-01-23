import React from 'react';
import { NavLink, useLocation } from "react-router-dom";
import "../style/menu2.css";

const Menu3 = () => {

    const location = useLocation();

  
  const isPrivatePassword = location.pathname === "/privatepassword";
  const isUserProfile = location.pathname === "/perfil-usuario";
  return (
    <>
      <header className="head">
        <div className="header-t">
          {/* <div className="btn-menu">
                <label for="btn-menu" className="cierre">
                  ☰
                </label>
              </div> */}
          <div className="logo-t">
            <NavLink to="/">
              <h3>
                {" "}
                Class <br />
                &nbsp; &nbsp; &nbsp; &nbsp; On
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Time
              </h3>
            </NavLink>
          </div>
          <nav className="nav-t">
            <ul>
              {/* <li>
                    <NavLink to="" className="link">
                      Tablero
                    </NavLink>
                  </li> */}
              <li>
                <NavLink to="/espaciodetrabajo" className="link">
                  Tableros
                </NavLink>
              </li>
              <li>
                {isPrivatePassword && !isUserProfile && (
                  <NavLink to="/perfil-user" className="link">
                    Ir a Perfil
                  </NavLink>
                )}
              </li>
            </ul>
            <div className="login-signup-t">
              <NavLink to="" className="link">
                <span className="material-symbols"> person_add </span>Compartir
              </NavLink>
            </div>
          </nav>
        </div>
        <div className="header-right-t">
          <div className="login-signup-ap">
            {/* {showCard && (
                  <div className="card-logout">
                    
                    <div className="logout-user">
                      <div className="icons-u">
                      <span id="icons"  className="material-symbols-outlined">person</span>
                      </div>
                      <div className="name-user"><span> {nameuser.username} </span></div>
                      <div className="email-user"> <span> {nameuser.email} </span>
                      </div>
                     
                      <ul className="ul-user">
                        
                        <li className="user-ul" onClick={handleLogout}>Logout  <span className="material-symbols-outlined">logout</span> </li>
                        
                      </ul>
                      
                    </div>  */}
          </div>
          <div className="hamburger-t">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="capa"></div>
    </>
  );
}

export default Menu3