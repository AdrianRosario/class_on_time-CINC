import React, { Fragment, useEffect, useState } from "react";
import {useNavigate, NavLink } from "react-router-dom";
import "./style/navbar_tareas.css";
import user from "./asset/img/icons8-user-40.png";
import logout from "./asset/img/icons8-logout-40 (2).png";
import chevron from "./asset/img/icon.png";
import imgprueba from'./asset/img/774418072505.jpg'
import './style/menu2.css'

const backend = process.env.REACT_APP_BACKEND;

const TareasPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [message, setMessage] = useState("");
  const [showSalida, setShowSalida] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [titlecolunm, setTitlecolunm] = useState("")

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
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
        setMessage(data.msg);

        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("jwt_token");
        // window.location.reload()
        // setIsAuthenticated(false);
        navigate("/");
      } else {
        setMessage("login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const clearFields = () => {
    setTitlecolunm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backend}/colunm`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          titlecolunm
        }),
      });

      if (res.status === 200){
        const data = await res.json();
        console.log(data)
        clearFields();
      }
      
    } catch (error) {
      console.error("Error during login:", error);
    }

    // showSalida(false);
  };
  

  const handleClick = () => setClick(!click);

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   showSalida(false);
  // };

  const toggleCreate = () => {
    setShowCreate(!showCreate);
  };
  const toggleSalida = () => {
    setShowSalida(!showSalida);
  };


  return (
    <>
      <header className="head">
        <div className="header-t">
          <div className="btn-menu">
            <label  className="cierre">
              ☰
            </label>
          </div>
          <div className="logo-t">
            <h3>prueba h1</h3>
          </div>
          <nav className="nav-t">
            <ul>
              <li>
                <NavLink to="/espaciodetrabajo" className="link">
                  Tablero
                </NavLink>
              </li>
              <li>
                <NavLink to="" className="link" onClick={toggleCreate}>
                  Crear
                </NavLink>
              </li>
              {showCreate && (
                <li>
                  <div className="card-create-t">
                    <div className="mver-card">
                      {!showSalida && (
                        <button className="btn-mver"  onClick={toggleSalida}>
                          Crear tablero
                        </button>
                      )}
                    </div>
                    {showSalida && (
                      <div className="card-form">
                        <form onSubmit={handleSubmit}>
                          <label className="lb-create">Crear tablero</label>
                          <input
                            className="input-create"
                            type="text"
                            placeholder="Titulo del tablero"
                            onChange={(e) => setTitlecolunm(e.target.value)}
                            value={titlecolunm}
                          />
                          <button className="btn-cr">Crear</button>
                        </form>
                        
                        <button className="btn-cr-cl" onClick={toggleSalida}>
                          {" "}
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )}
            </ul>
            {/* <div className="login-signup-t">
              <NavLink to="/shareuser" className="link">
                <span className="material-symbols"> person_add </span>Compartir
              </NavLink>
            </div> */}
          </nav>
        </div>
        <div className="header-right-t">
          {/* <div className="login-signup-t">
            
            <button>
              <span className="material-symbols-outlined"> person_add </span>
              <span className="lable">Compartir</span>
            </button>
            
          </div> */}
          <div className="hamburger-t">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="capa"></div>

      <input type="checkbox" id="btn-menu" />
      <div className="container-menu">
        <div className="cont-menu">
          <nav className="nav-l">
            <NavLink to="#" className="link">
              <span className="material-symbols-outlined"> person </span>
              Miembros
              <span className="material-symbols-outlined"> add </span>
            </NavLink>
            <NavLink to="#" className="link">
              <span className="material-symbols-outlined"> settings </span>
              Ajuste del Espacio de trabajo
            </NavLink>
            <br />

            <label className="label-sindebar">
              Vista del Espacio de trabajo
            </label>
            <NavLink to="#" className="link">
              <span className="material-symbols-outlined"> data_table </span>
              Tabla
            </NavLink>
            <NavLink to="#" className="link">
              <span className="material-symbols-outlined">
                {" "}
                calendar_month{" "}
              </span>
              Calendario
            </NavLink>

            <label className="label-sindebar">
              Sus tablero <span className="material-symbols-outlined">add</span>
            </label>
            <ul className="nav-list">
              <li className="profile">
                <div className="profile_details">
                  <img src={imgprueba} alt="profile image" />
                  <div className="profile_content">
                    <div className="name">Anna Jhon</div>
                    <div className="designation">Admin</div>
                  </div>
                </div>
                {/* <i class="bx bx-log-out" id="log_out"></i> */}
                <span className="material-symbols-outlined" id="log_out" >logout</span>
              </li>
            </ul>
          </nav>

          <label  className="cierre">
            ✖️
          </label>
        </div>
      </div>
    </>
  );
};

export default TareasPage;
