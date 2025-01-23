import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../style/menu2.css";



const Menu2 = () => {

  const backend = process.env.REACT_APP_BACKEND;


  const [showCard, setShowCard] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showSalida, setShowSalida] = useState(false);
  const [message, setMessage] = useState("");
  const [nameboard, setNameboard] = useState('')
  const [board, setBoard] = useState([]);
  const [nameuser, setNameuser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

 

  const clearFields = () => {
    setNameboard("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = sessionStorage.getItem("user_id");
    const authentication_token = localStorage.getItem("authentication_token");
    try {
      const res = await fetch(`${backend}/board`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authentication_token}`,

        },
        body: JSON.stringify({
          nameboard,
          user_id
        }),
      });

      if (res.status === 200){
        const data = await res.json();
        console.log(data)
        clearFields();
        setShowCreate(false);
        window.location.reload()
      }
      
    } catch (error) {
      console.error("Error during login:", error);
    }

    // showSalida(false);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backend}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        setMessage(data.msg);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("jwt_token");
        navigate("/");
      } else {
        setMessage("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getUser = async () => {
    const res = await fetch(`${backend}/user-profile`);
    if (res.status === 401) {
      console.log("Unauthorized");
      return;
    }
    const data = await res.json();
    setNameuser(data);
  };
  useEffect(() => {
    getUser();
    
  },[]);
  
 

  const toggleCard = () => {
    setShowCard(!showCard);
  };
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
          {/* <div className="btn-menu">
            <label for="btn-menu" className="cierre">
              ☰
            </label>
          </div> */}
          <div className="logo-t">
            <NavLink to='/'>
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
              <li onClick={toggleCreate}>
                <NavLink to="#" className="link">
                  Crear
                </NavLink>
              </li>

              {showCreate && (
                <li>
                  <div className="card-create">
                    <div className="mver-card">
                      {!showSalida && (
                        <button className="btn-mver" onClick={toggleSalida}>
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

                            onChange={(e) => setNameboard(e.target.value)}
                            value={nameboard}
                          />
                          <button type="submit" className="btn-cr">Crear</button>
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
            <div className="login-signup-t">
              <NavLink to="" className="link">
                <span className="material-symbols"> person_add </span>Compartir
              </NavLink>
            </div>
          </nav>
        </div>
        <div className="header-right-t">
          <div className="login-signup-ap">
            <button className="btn-ap" onClick={toggleCard}>
              <span className="material-symbols-outlined">person</span>
            </button>

            {showCard && (
              <div className="card-logout">
                
                <div className="logout-user">
                  <div className="icons-u">
                  <span id="icons"  className="material-symbols-outlined">person</span>
                  </div>
                  <div className="name-user"><span> {nameuser.username} </span></div>
                  <div className="email-user"> <span> {nameuser.email} </span>
                  </div>
                  {/* <h4 className="h4-m"><span id="icons"  className="material-symbols-outlined">person</span>Adrian Rosario <br/><span className="spm">goiryreyes08@gmail.com</span></h4> */}
                  <ul className="ul-user">
                    
                    <li className="user-ul" onClick={handleLogout}>Logout  <span className="material-symbols-outlined">logout</span> </li>
                    
                  </ul>
                  
                </div>
                {/* <div className="menu-user">
                 
                  
                  <span className="name"><span id="icons"  className="material-symbols-outlined">person</span>prueba</span>
                  <span className="email">jkfdjkaskjdnasjk</span>
                  </div>
                
                  
                <div className="logout-user">
                  <button className="btn-lgot" onClick={handleLogout}>
                    Logout <span className="material-symbols-outlined">logout</span>
                  </button>
                </div> */}
              </div>
            )}
          </div>
          <div className="hamburger-t">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="capa"></div>

      {/* <input type="checkbox" id="btn-menu" />
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
              Sus tablero <span class="material-symbols-outlined">add</span>
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
                
                <span className="material-symbols-outlined" id="log_out" >logout</span>
              </li>
            </ul>
          </nav>

          <label for="btn-menu" className="cierre">
            ✖️
          </label>
        </div> */}
      {/* </div> */}
    </>
  );
};

export default Menu2;
