import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/navbar_tareas.css";
import user from "./asset/img/user (2).png";
import logout from "./asset/img/logout.png";

const backend = process.env.REACT_APP_BACKEND;

const TareasPage = ({ setIsAuthenticated }) => {
  const navegate = useNavigate();

  const handleLogout = async () => {
    // // localStorage.removeItem("user");
    // localStorage.removeItem('isAuthenticated');
    // // setIsAuthenticated(false);
    // window.location.reload();
    // navegate('/');

    const res = await fetch(`${backend}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // const data = await res.json();
    // console.log(data)

    if (res.status === 200) {
      const data = await res.json();
      console.log(data);

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("jwt_token");
      // window.location.reload()
      // setIsAuthenticated(false);
      navegate("/");
    } else {
      console.log("Logout failed");
    }

    // const data = await res.json();
    // console.log(data)
    // localStorage.removeItem("user");
    // localStorage.removeItem("isAuthenticated");

    // setIsAuthenticated(false);

    // navegate("/");
  };

  return (
    <Fragment>
      <header className="head-navbar">
        <div className="header-left">
          <div className="logo">
            <Link to="/" className="log" target="_black">
              <h1 className="logo">
                Class <br />
                &nbsp; &nbsp; &nbsp; &nbsp; On
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Time
              </h1>
            </Link>
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/Addtasks" className="active">
                  Add
                  <span className="material-symbols-outlined">add</span>
                </Link>
              </li>
              <li>
                <Link to="/Education">
                  Educacion
                  <span className="material-symbols-outlined">menu_book</span>
                </Link>
              </li>
              <li>
                <Link to="/Mythings">
                  Mis Cosas
                  <span className="material-symbols-outlined">
                    person_raised_hand
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/Myjob">
                  Mi Trabajo
                  <span className="material-symbols-outlined">engineering</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="header-logout">
          <div className="logout-signup">
            <Link className="button-L" onClick={handleLogout}>
              <img src={user} alt="" />
              <div className="logout-L">
                Logout
                <img src={logout} alt="" />
              </div>
            </Link>
          </div>
          <div className="hamburger">
            <div />
            <div />
            <div />
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default TareasPage;
