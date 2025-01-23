import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import "./style/navbar_tareas.css";
import imgprueba from "./asset/img/774418072505.jpg";
import "./style/menu2.css";
import WorkSpace from "./components/WorkSpace";
import ToastNotification, {showToast} from "./components/ToastNotification";
import ConfirmDialog from "./components/ConfirmDialog";
const backend = process.env.REACT_APP_BACKEND;

const TareasPage = ({ setIsAuthenticated, fetchColumns, selectedRole, boarshare }) => {
  const navigate = useNavigate();
  const { board_id } = useParams();
  const { id } = useParams();
  console.log(id)
 
  const [click, setClick] = useState(false);
  const [message, setMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [titlecolumn, setTitlecolumn] = useState("");
  const [columns, setColumns] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [nameuser, setNameuser] = useState({});
  // const [userboard, setUserboard] = useState([]);
  const [userboard, setUserboard] = useState({
    created_boards: [],
    shared_boards: [],
  });
  
  const [nameboard, setNameBoard] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
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

      if (res.status === 200) {
        const data = await res.json();
        setMessage(data.msg);
        showToast("Sesión cerrada correctamente", "success");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("jwt_token");
        navigate("/");
      } else {
        setMessage("Logout failed");
        showToast("Error al cerrar sesión", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error de red al cerrar sesión", "error");
    }
  };

  const clearFields = () => {
    setTitlecolumn("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backend}/column`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titlecolumn,
          board_id: id,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        clearFields();
        fetchColumns();

        // getColumns();
        setShowCreate(false);
        showToast("Columna creada correctamente", "success");
      } else {
        showToast("Error al crear la columna", "error");
      }
    } catch (error) {
      console.error("Error during column creation:", error);
      showToast("Error de red al crear la columna", "error");
    }
  };

  const getColumns = async () => {
    if (!board_id) return;

    try {
      const res = await fetch(`${backend}/board/${board_id}/column`);
      if (res.status === 200) {
        const data = await res.json();
        setColumns(data);
      }
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  useEffect(() => {
    getColumns();
  }, [board_id]);

  const getUser = async () => {
    const res = await fetch(`${backend}/user-profile`);
    if (res.status === 401) {
      console.log("Unauthorized");
      return;
    }
    const data = await res.json();
    setNameuser(data);
  };




  const getBoards = async () => {
    try {
      const res = await fetch(`${backend}/board`);
      if (res.status === 200) {
        const data = await res.json();
        setUserboard({
          created_boards: data.created_boards,
          shared_boards: data.shared_boards,
        });
      } else {
        console.error("Error fetching boards:", res.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getBoardTitle = (id) => {
    // Buscar en los tableros creados
    const createdBoard = userboard.created_boards.find((board) => board._id === id);
  
    // Si no se encuentra en creados, buscar en los compartidos
    if (!createdBoard) {
      const sharedBoard = userboard.shared_boards.find((board) => board._id === id);
      return sharedBoard ? sharedBoard.nameboard : "Título no disponible";
    }
  
    return createdBoard.nameboard;
  };
  
  
  
  useEffect(() => {
    getUser();
    getBoards();
  }, []);

  const toggleCreate = () => {
    setShowCreate(!showCreate);
  };
  const toggleCard = () => {
    setShowCard(!showCard);
  };
  const toggleupdate = () => {
    setShowUpdate(!showUpdate);
  };

  const handleClick = () => setClick(!click);

  const handleboard = async (e) =>{
    e.preventDefault();

    try {
      const response = await fetch(`${backend}/board/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameboard,
          
        }),
      });

      const data = await response.json();
      clearFields();
      setShowUpdate(false);
      getBoards();
      showToast("Título actualizado exitosamente.", "success");
    } catch (error) {
      console.error("Error updating password:", error);
    }

  }
  const handleEditboard = () => {
    const currentTask = userboard.created_boards.find((board) => board._id === id);
    if (currentTask) {
      setNameBoard(currentTask.nameboard); // Cargar el título actual en el estado
      
    }
    toggleupdate(); 
    // Mostrar el campo de entrada
  };
  
  
  
  
    const handleDeleteBoard = async (boardId) => {
      // Función que realiza la eliminación
      const confirmDelete = async () => {
        try {
          const res = await fetch(`${backend}/board/${boardId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (res.status === 200) {
            const data = await res.json();
            showToast(data.message, "success");
  
            // Redirige al tablero principal
            navigate("/espaciodetrabajo");
          } else {
            const data = await res.json();
            showToast(data.message || "Error al eliminar el tablero", "error");
          }
        } catch (error) {
          console.error("Error eliminando el tablero:", error);
          showToast("Error de red al eliminar el tablero", "error");
        }
      };
  
  const showConfirm = ConfirmDialog({
    message: "¿Estás seguro de que deseas eliminar este tablero? Esta acción no se puede deshacer.",
    onConfirm: confirmDelete, // Ejecuta la eliminación si se confirma
  });

  // Muestra el diálogo
  showConfirm();
};
  return (
    <>
      
      <header className="head">
        <div className="header-t">
          <div className="btn-menu">
            <label className="cierre">
              <span className="material-symbols-outlined">assignment</span>
            </label>
          </div>

          <div className="logo-t">
            <h3 onClick={selectedRole === "administrador" ? handleEditboard : null}>
              {getBoardTitle(id)}
            </h3>
            {/* <h3 onClick={role === "administrador" ? handleEditboard : null}>
              {userboard.find((board) => board._id === id)?.nameboard ||
                "title no disponible"}
            </h3> */}

            {/* <h3 onClick={role === "administrador" ? handleEditboard : null}>
              {" "}
              {userboard.find((board) => board._id === id)?.nameboard ||
                "title no disponible"}{" "}
            </h3> */}
          </div>
          {showUpdate && selectedRole === "administrador" && (
            <div className="div-nameboard">
              <form onSubmit={handleboard}>
                <input
                  type="text"
                  name="text"
                  autoComplete="off"
                  onChange={(e) => setNameBoard(e.target.value)}
                  value={nameboard}
                />
                <button className="btn-title">guardar</button>
              </form>
            </div>
          )}

          <nav className="nav-t">
            <ul>
              <li>
                <NavLink to="/espaciodetrabajo" className="link">
                  Tablero
                </NavLink>
              </li>
              {selectedRole === "administrador" && (
                <li>
                  <NavLink to="" className="link" onClick={toggleCreate}>
                    Crear
                  </NavLink>
                </li>
                
              )}

              {showCreate && (
                <li>
                  <div className="card-create-t">
                    <div className="mver-card">
                      <button className="btn-mver" onClick={toggleCreate}>
                        Crear columna
                      </button>
                    </div>
                    <div className="card-form">
                      <form onSubmit={handleSubmit}>
                        <label className="lb-create">Crear columna</label>
                        <input
                          className="input-create"
                          type="text"
                          placeholder="Titulo de la columna"
                          onChange={(e) => setTitlecolumn(e.target.value)}
                          value={titlecolumn}
                        />
                        <button className="btn-cr">Crear</button>
                      </form>
                      <button className="btn-cr-cl" onClick={toggleCreate}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
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
              <div className="carddrag-logout">
                <div className="logout-user">
                  <div className="icons-u">
                    <span id="icons" className="material-symbols-outlined">
                      person
                    </span>
                  </div>
                  <div className="name-user">
                    <span> {nameuser.username} </span>
                  </div>
                  <div className="email-user">
                    {" "}
                    <span> {nameuser.email} </span>
                  </div>

                  <ul className="ul-user">
                    <li className="user-ul" onClick={handleLogout}>
                      <NavLink>
                        Logout{" "}
                        <span className="material-symbols-outlined">
                          logout
                        </span>{" "}
                      </NavLink>
                    </li>
                    <li className="user-ul">
                      <NavLink to="/privatepassword"> ResetPassword</NavLink>{" "}
                    </li>
                    <li className="user-ul">
                      <NavLink to="/perfil-user"> Perfil Usuario</NavLink>{" "}
                    </li>
                    <li className="user-ul" onClick={() => handleDeleteBoard(id)}>
                      <NavLink> Cerrar Tablero</NavLink>
                      
                    </li>
                  </ul>
                </div>
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
                <span className="material-symbols-outlined" id="log_out">
                  logout
                </span>
              </li>
            </ul>
          </nav>
          <label className="cierre">✖️</label>
        </div>
      </div>
    </>
  );
};

export default TareasPage;
