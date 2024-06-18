import { useState } from "react";
import React from "react";
import "../style/carddrag1.css";
import "../style/shareuser.css";

import TareasPage from "../TareasPage";

const Createcard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showMover, setShowMover] = useState(false);
  const [showCarduser, setShowCarduser] = useState(false);
  const [namecard, setNamecard] = useState("")
  const backend = process.env.REACT_APP_BACKEND;
  const clearFields = () => {
    setNamecard("");
  };

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Tarea 1",
      body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit ipsum dolor.",
      list: 1,
    },
    {
      id: 2,
      title: "Tarea 2",
      body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit ipsum dolor.",
      list: 1,
    },
    {
      id: 3,
      title: "Tarea 3",
      body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit ipsum dolor.",
      list: 3,
    },
    {
      id: 4,
      title: "Tarea 4",
      body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit ipsum dolor.",
      list: 2,
    },
    {
      id: 5,
      title: "Tarea 5",
      body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit ipsum dolor.",
      list: 2,
    },
  ]);

  const getList = (list) => {
    return tasks.filter((item) => item.list === list);
  };

  const startDrag = (evt, item) => {
    evt.dataTransfer.setData("itemID", item.id);
    console.log(item);
  };

  const draggingOver = (evt) => {
    evt.preventDefault();
  };

  // const onDrop = (evt, list) => {
  //   const itemID = evt.dataTransfer.getData("itemID");
  //   const item = tasks.find((item) => item.id === itemID);
  //   item.list = list;

  //   const newState = tasks.map((task) => {
  //     if (task.id === itemID) return item;
  //     return task;
  //   });

  //   setTasks(newState);
  // };
  const onDrop = (evt, list) => {
    const itemID = evt.dataTransfer.getData("itemID");
    const itemIndex = tasks.findIndex((item) => item.id === parseInt(itemID));

    if (itemIndex !== -1) {
      const updatedItem = { ...tasks[itemIndex], list };
      const updatedTasks = [...tasks];
      updatedTasks[itemIndex] = updatedItem;
      setTasks(updatedTasks);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backend}/card`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          namecard
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
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // Aquí puedes agregar la lógica para procesar el envío del formulario si es necesario
  //   // Por ejemplo, enviar datos a través de una función prop o realizar otra acción
  //   setShowForm(false);
  // };
  const toggleCard = () => {
    setShowCard(!showCard); // Cambiar el estado de visibilidad al hacer clic
  };
  const toggleUser = () => {
    setShowUser(!showUser);
    // Cambiar el estado de visibilidad al hacer clic
  };
  const toggleMover = () => {
    setShowMover(!showMover); // Cambiar el estado de visibilidad al hacer clic
  };
  const toggleCarduser = () => {
    setShowCarduser(!showCarduser); // Cambiar el estado de visibilidad al hacer clic
  };

  return (
    <>
      <TareasPage />
      <h1 className="h1-drag">
        Arrastrar y Soltar &nbsp;
        <img className="icon-react" src="src/assets/react.svg" alt="" />
      </h1>
      <button className="prueba-btn" onClick={toggleCarduser}>
        <span className="material-symbols-outlined"> person_add </span>
        <span className="lable">Compartir</span>
      </button>

      {showCarduser && (
        <div className="cont-form">
          <div className="cont-frm">
            <form className="form" onSubmit={handleSubmit}>
              <div className="note">
                <label className="title">Compartir tablero</label>
                <span className="subtitle">
                  aqui puedes invitar nuevo usuarios a usar tu tablero con
                  varios roles obsevador, miembro, administrador
                </span>
              </div>
              <div className="information">
                <input
                  type="text"
                  placeholder="Direccion de correo electronico"
                  className="input_field"
                />
                <select name="" id="" className="select">
                  <option value="">Miembros</option>
                  <option value="">Observador</option>
                  <option value="">Administrador</option>
                </select>
                <button className="submit">Compartir</button>
              </div>
              {/* <button className="submit">enviar</button> */}
            </form>
            <div className="closet-card" onClick={toggleCarduser}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>
        </div>
      )}
      <br />

      {showCard && (
        <div className="card-cont">
          <div className="cont-drag">
            <div className="cont-tn">
              <h2>
                <span className="material-symbols-outlined">
                  team_dashboard
                </span>
                Título de la tarjeta
              </h2>
              <div className="cont-dct">
                <h3>
                  <span className="material-symbols-outlined">subject</span>
                  Descripción
                </h3>
                <button className="btn-dct">Editar</button>
                <div className="pt-dct">
                  <span className="span-dct">
                    Descripción guardada en la tarjeta
                  </span>
                </div>
              </div>
            </div>

            <div className="card-ul">
              <label className="lb">Añadir a la tarjeta</label>
              <ul>
                <li className="li" onClick={toggleUser}>
                  <span className="material-symbols-outlined">person</span>
                  Miembro
                </li>

                {showUser && (
                  <li>
                    <div className="card-usr">
                      <div className="pst-usr" onClick={toggleUser}>
                        <label className="lb-usr">Miembros</label>
                        <span className="material-symbols-outlined">close</span>
                      </div>
                      <input
                        className="input-usr"
                        type="text"
                        placeholder="Buscar miembros"
                      />
                      <label className="lb-mb">Miembros del tablero</label>
                      <span className="sp-mb">adrianrosario660@gmail.com</span>
                    </div>
                  </li>
                )}

                <li className="li">
                  <span className="material-symbols-outlined">schedule</span>
                  Fecha
                </li>
                <li className="li" onClick={toggleMover}>
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                  Mover
                </li>

                {showMover && (
                  <li>
                    <div className="card-mv">
                      <div className="pst-mv" onClick={toggleMover}>
                        <label className="lb-mv">Mover targeta</label>
                        <span className="material-symbols-outlined">close</span>
                      </div>
                      <label className="lb-mv">Sugerencias</label>
                      <button className="btn-mv">
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                        Hecho
                      </button>
                      <label className="lb-dt">seleccionar destino</label>
                      <div className="mv-dt">
                        <label className="lb-lt">Lista</label>
                        <select className="slt-mv">
                          <option className="option">tareas por hacer</option>
                          <option className="option">tareas en progreso</option>
                          <option className="option">tareas realizadas</option>
                          <option className="option">tareas entregada</option>
                        </select>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <div className="closet-card" onClick={toggleCard}>
              <span className="material-symbols-outlined">close</span>
            </div>
          </div>
        </div>
      )}

      <div className="drag-and-drop">
        <div className="column column--1">
          <h3 className="h3-drag">Tareas por hacer</h3>
          <div
            className="dd-zone"
            droppable="true"
            onDragOver={(evt) => draggingOver(evt)}
            onDrop={(evt) => onDrop(evt, 1)}
          >
            {getList(1).map((item) => (
              <div
                className="dd-element"
                key={item.id}
                draggable
                onDragStart={(evt) => startDrag(evt, item)}
                onClick={toggleCard}
              >
                <strong className="title">{item.title}</strong>
                <span className="edit-drag">
                  {" "}
                  <span className="material-symbols-outlined">edit</span>
                </span>
                <p className="body">{item.body}</p>
              </div>
            ))}
          </div>
          <button className="btn-drag">
            <span className="material-symbols-outlined"> add </span> crear
            targeta
          </button>
        </div>

        <div className="column column--2">
          <h3 className="h3-drag">Tareas en progreso</h3>
          <div
            className="dd-zone"
            droppable="true"
            onDragOver={(evt) => draggingOver(evt)}
            onDrop={(evt) => onDrop(evt, 2)}
          >
            {getList(2).map((item) => (
              <div
                className="dd-element"
                key={item.id}
                draggable
                onDragStart={(evt) => startDrag(evt, item)}
              >
                <strong className="title">{item.title}</strong>
                <p className="body">{item.body}</p>
              </div>
            ))}
          </div>
          <button className="btn-drag">
            <span className="material-symbols-outlined"> add </span> crear
            targeta
          </button>
        </div>

        <div className="column column--3">
          <h3 className="h3-drag">Tareas realizadas</h3>
          <div
            className="dd-zone"
            droppable="true"
            onDragOver={(evt) => draggingOver(evt)}
            onDrop={(evt) => onDrop(evt, 3)}
          >
            {getList(3).map((item) => (
              <div
                className="dd-element"
                key={item.id}
                draggable
                onDragStart={(evt) => startDrag(evt, item)}
              >
                <strong className="title">{item.title}</strong>
                <span className="edit-drag">
                  {" "}
                  <span className="material-symbols-outlined">edit</span>
                </span>
                <p className="body">{item.body}</p>
              </div>
            ))}
          </div>
          <button className="btn-drag">
            <span className="material-symbols-outlined"> add </span> crear
            targeta
          </button>
        </div>
        <div className="column column--4">
          <h3 className="h3-drag">Tareas entregada</h3>
          <div
            className="dd-zone"
            droppable="true"
            onDragOver={(evt) => draggingOver(evt)}
            onDrop={(evt) => onDrop(evt, 4)}
          >
            {getList(4).map((item) => (
              <div
                className="dd-element"
                key={item.id}
                draggable
                onDragStart={(evt) => startDrag(evt, item)}
              >
                <strong className="title">{item.title}</strong>
                <span className="edit-drag">
                  {" "}
                  <span className="material-symbols-outlined">edit</span>
                </span>
                <p className="body">{item.body}</p>
              </div>
            ))}
          </div>

          {!showForm && (
            <button className="btn-drag" onClick={toggleForm}>
              <span className="material-symbols-outlined"> add </span> crear
              tarjeta
            </button>
          )}

          {showForm && (
            <div className="prueba">
              <form onSubmit={handleSubmit}>
                <input
                  className="input-drag"
                  type="text"
                  placeholder="Introduzca un título para esta tarjeta"

                  onChange={(e) => setNamecard(e.target.value)}
                  value={namecard}
                />
                <button className="btn-dragC" type="submit">
                  Agregar tarjeta
                </button>
                <button className="btn-closet" onClick={toggleForm}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Createcard;
