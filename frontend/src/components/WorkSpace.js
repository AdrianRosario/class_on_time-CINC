import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/workspace.css";
import Menu2 from "./Menu2";
import "../style/navbar_tareas.css";

const backend = process.env.REACT_APP_BACKEND;

const WorkSpace = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [boards, setBoards] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.elements.title.value;

    const res = await fetch(`${backend}/board`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nameboard: title }),
    });

    if (res.ok) {
      const newBoard = await res.json();
      setBoards([...boards, newBoard]);
      setShowCreate(false);
    }
  };

  const getBoards = async () => {
    const res = await fetch(`${backend}/board`);
    if (res.status === 401) {
      console.log("Unauthorized");
      return;
    }
    const data = await res.json();
    setBoards(data);
  };

  useEffect(() => {
    getBoards();
  }, []);

  const toggleCreate = () => {
    setShowCreate(!showCreate);
  };
  return (
    <>
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
              <div className="card-bgr">
                <Link to='/createcard'>
                <span className="span-work">CARD1 </span>
                </Link>
              </div>
              <div className="card-bgr">
                <span className="span-work">CARD1 </span>
              </div>
              <div className="card-bgr">
                <span className="span-work">CARD1 </span>
              </div>
              <div className="card-b">
                <button className="btn-space" onClick={toggleCreate}>Crear un tablero nuevo </button>
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
                    />
                  </form>
                  <button className="btn-cr">Crear</button>
                  <button className="btn-cr-cl" onClick={toggleCreate}>
                    {" "}
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>
        </header>
      </article>
    </>
  );
};

export default WorkSpace;
