import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/workspace.css";
import Menu2 from "./Menu2";
import "../style/navbar_tareas.css";
import "../style/styles_card.css";
import Authenticate from "./Authenticate";
import ToastNotification, {showToast} from "./ToastNotification";


const backend = process.env.REACT_APP_BACKEND;

const WorkSpace = ({ setIsAuthenticated}) => {
  const [showCreate, setShowCreate] = useState(false);

  const [nameboard, setNameboard] = useState("");
  const [createdBoards, setCreatedBoards] = useState([]);
  const [sharedBoards, setSharedBoards] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const authentication_token = localStorage.getItem("authentication_token");

    try {
      const res = await fetch(`${backend}/board`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authentication_token}`,
        },
        body: JSON.stringify({
          nameboard,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setShowCreate(false);
        getBoards();
        showToast("Tablero creado correctamente", "success");
      }else {
        showToast("Error al crear su Tablero", "error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showToast("Error de red al crear su Tablero", "error");
    }

    // showSalida(false);
  };


  const getBoards = async () => {
    try {
      const res = await fetch(`${backend}/board`);
      if (res.status === 401) {
        console.log("Unauthorized");
        return;
      }
      const data = await res.json();
      setCreatedBoards(data.created_boards);
      setSharedBoards(data.shared_boards);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };
  

  useEffect(() => {
    getBoards();
   
    
  }, []);

  const toggleCreate = () => {
    setShowCreate(!showCreate);
  };

  return (
    <>
      <Authenticate setIsAuthenticated={setIsAuthenticated} />
      <ToastNotification/>
      <Menu2 />
      <article>
        <header className="conten-space">
          <div className="conte-space">
            <ul className="cont-space">
              <li className="li-space">
                <Link to="#">
                  <span className="material-symbols-outlined">
                    {" "}
                    data_table{" "}
                  </span>
                  Tablero
                </Link>
              </li>
              <li className="li-space">
                <Link to="#">
                  <span className="material-symbols-outlined"> home </span>
                  Inicio
                </Link>
              </li>
              {/* <li className="li-space">
                <Link to="#">
                  Crear <span className="material-symbols-outlined"> add </span>
                </Link>
              </li> */}
              <label className="lb-space">
                <span className="material-symbols-outlined">
                  e_mobiledata_badge{" "}
                </span>
                Espacio de trabajo
              </label>
              <li className="li-space">
                <Link to="#">
                  <span className="material-symbols-outlined"> group </span>
                  Miembros
                </Link>
              </li>
              <li className="li-work">
                <Link to="#">
                  <span className="material-symbols-outlined">settings</span>
                  Configuracion
                </Link>
              </li>
            </ul>
          </div>

          <div className="container-space">
            <div className="espacio-space">
              <label className="lb-cont">TUS ESPACIO DE TRABAJO</label>
            </div>

            {/* {boards.map((board) => (
              <div key={board.id} className="work-card">
                <div className="card-bgr">
                  <Link to="/createcard">
                    <span className="span-work">{board.nameboard}</span>
                  </Link>
                </div>
                </div>
              
            ))} */}

            <div className="work-card">
            {createdBoards.map((board) => (
                  <div key={board._id} className="card-bgr">
                    <Link to={`/board/${board._id}`}>
                      <span className="span-work">{board.nameboard}</span>
                    </Link>
                </div>
              ))}
              {/* <div className="card-bgr">
                <Link to='/createcard'>
                <span className="span-work">CARD1 </span>
                </Link>
              </div>
              <div className="card-bgr">
                <span className="span-work">CARD1 </span>
              </div>
              <div className="card-bgr">
                <span className="span-work">CARD1 </span>
              </div> */}
              <div className="card-b">
                <button className="btn-space" onClick={toggleCreate}>
                  Crear un tablero nuevo{" "}
                </button>
              </div>
              <div className="card-create-u">
                {/* <div className="mver-card">
                      {!showSalida && (
                        <button className="btn-mver" onClick={toggleSalida}>
                          Crear tablero
                        </button>
                      )} */}

                {showCreate && (
                  <div className="card-form-u">
                    <form onSubmit={handleSubmit}>
                      <label className="lb-create">Crear tablero</label>
                      <input
                        className="input-create"
                        type="text"
                        placeholder="Titulo del tablero"
                        onChange={(e) => setNameboard(e.target.value)}
                        value={nameboard}
                        required
                      />
                      <button type="submit" className="btn-cr">
                        Crear
                      </button>
                    </form>
                    {/* <button className="btn-cr">Crear</button> */}
                    <button className="btn-cr-cl" onClick={toggleCreate}>
                      {" "}
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="espacio-share">
              <label className="lb-cont">
                ESPACIOS DE TRABAJO EN LOS QUE ERES INVITADO
              </label>
            </div>
            
            
            <div className="work-card">
            {sharedBoards.map((board) => (
                  <div key={board._id} className="card-bgr">
                    <Link to={`/board/${board._id}`}>
                      <span className="span-work">{board.nameboard}</span>
                    </Link>
                </div>
              ))}
              </div>
          </div>
        </header>
      </article>
    </>
  );
};

export default WorkSpace;
