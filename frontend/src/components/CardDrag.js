import { useState, useEffect } from "react";
import React from "react";
import "../style/carddrag1.css";
import "../style/shareuser.css";
import "../style/carddrag.css";
import TareasPage from "../TareasPage";

const Createcard = () => {
  const [showForm, setShowForm] = useState({});
  const [showCard, setShowCard] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showMover, setShowMover] = useState(false);
  const [showTxt, setShowTxt] = useState(false);
  const [showTxt2, setShowTxt2] = useState(false);
  const [showCarduser, setShowCarduser] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editingDescription, setEditingDescription] = useState("");
  

  

  const backend = process.env.REACT_APP_BACKEND;

  useEffect(() => {
    fetchColumns();
    fetchTasks();
    fetchDescription();
  }, []);


  const fetchColumns = async () => {
    try {
      const response = await fetch(`${backend}/colunm`);
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };
  const fetchDescription = async () => {
    try {
      const response = await fetch(`${backend}/description`);
      const data = await response.json();
      setDescriptions(data);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${backend}/card`);
      if (res.status === 200) {
        const data = await res.json();
        setTasks(data);
      } else {
        console.log("Failed to fetch cards");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const clearFields = () => {
    setTitle("");
    setDescription("");
  };

  const getList = (columnId) => {
    return tasks
      .filter((item) => item.list === columnId)
      .sort((a, b) => a.position - b.position);
  };

  const startDrag = (evt, item, startColumn) => {
    evt.dataTransfer.setData("itemID", item._id);
    evt.dataTransfer.setData("startColumn", startColumn);
    evt.dataTransfer.effectAllowed = "move";
    console.log(item);
  };

  const draggingOver = (evt) => {
    evt.preventDefault();
  };

  const onDrop = async (evt, list) => {
    const itemID = evt.dataTransfer.getData("itemID");
    const startColumn = evt.dataTransfer.getData("startColumn");
    const itemIndex = tasks.findIndex((item) => item._id === itemID);

    if (itemIndex !== -1) {
      const updatedItem = {
        ...tasks[itemIndex],
        list,
        position: getList(list).length,
      };
      const updatedTasks = [...tasks];

      if (startColumn !== list) {
        updatedTasks.splice(itemIndex, 1);
        updatedTasks.push(updatedItem);

        getList(startColumn).forEach((item, index) => {
          if (item._id !== itemID) {
            const taskIndex = updatedTasks.findIndex((t) => t._id === item._id);
            updatedTasks[taskIndex].position = index;
          }
        });
        getList(list).forEach((item, index) => {
          if (item._id === itemID) {
            updatedItem.position = index;
          } else {
            const taskIndex = updatedTasks.findIndex((t) => t._id === item._id);
            updatedTasks[taskIndex].position = index + 1;
          }
        });
      } else {
        updatedTasks[itemIndex] = updatedItem;
        getList(list).forEach((item, index) => {
          const taskIndex = updatedTasks.findIndex((t) => t._id === item._id);
          updatedTasks[taskIndex].position = index;
        });
      }

      setTasks(updatedTasks);

      try {
        await fetch(`${backend}/card/${itemID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        });
      } catch (error) {
        console.error("Error updating card position:", error);
      }
    }
  };

  const toggleForm = (columnId) => {
    setShowForm((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
    setSelectedColumn(columnId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backend}/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          list: selectedColumn,
          position: getList(selectedColumn).length,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        clearFields();
        fetchTasks();
        setShowForm((prev) => ({ ...prev, [selectedColumn]: false }));
      }
    } catch (error) {
      console.error("Error during submit:", error);
    }
    try {
      const res = await fetch(`${backend}/description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        clearFields();
      }
    } catch (error) {
      console.error("Error during submit:", error);


    }
  };
  const handleEditDescription = (description) => {
    setEditingTask(description);
    setEditingDescription(description.description); // Set the current description to the textarea
    setShowTxt2(true); // Show the textarea for editing
  };

  const handleEditChange = (e) => {
    setEditingTask(e.target.value);
  };

  const saveEditedTask = async () => {
    if (editingTask) {
      try {
        const response = await fetch(`${backend}/description/${editingTask._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: editingDescription }),
        });
  
        if (response.status === 200) {
          await fetchDescription();
          setEditingTask(null);
          setEditingDescription("");
          setShowTxt2(false);
        } else {
          console.error("Error updating description");
        }
      } catch (error) {
        console.error("Error updating description:", error);
      }
    }
  };


  const toggleCard = () => {
    setShowCard(!showCard);
  };

  const toggleUser = () => {
    setShowUser(!showUser);
  };

  const toggleMover = () => {
    setShowMover(!showMover);
  };
  const toggleTxt = () => {
    setShowTxt(!showTxt);
  };
  const toggleTxt2 = () => {
    setShowTxt2(!showTxt2);
  };

  const toggleCarduser = () => {
    setShowCarduser(!showCarduser);
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
                  Aqui puedes invitar nuevo usuarios a usar tu tablero con
                  varios roles: observador, miembro, administrador
                </span>
              </div>
              <div className="information">
                <input
                  type="text"
                  placeholder="Direccion de correo electronico"
                  className="input_field"
                />
                <select name="" id="" className="select">
                  <option value="">Miembro</option>
                  <option value="">Observador</option>
                  <option value="">Administrador</option>
                </select>
                <button className="submit">Compartir</button>
              </div>
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
                <button className="btn-dct" onClick={toggleTxt2} >Editar</button>
                <div className="pt-dct">
                  {!showTxt && (
                    <button className="btn-dc" onClick={toggleTxt}>
                       {descriptions.map((description) => (
                        <span className="span-dct" key={description._id}>
                          {description.description ||  'Descripción guardada en la tarjeta'}
                         
                      </span>
                       ))}
                      
                    </button>
                  )}
                </div>
              </div>
              
              {showTxt && (
                <div className="txr">
                  <form onSubmit={handleSubmit}>
                    <textarea
                      className="input-txr"
                      type="text"
                      placeholder="Introduzca un título para esta tarjeta"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                    <button className="btn-txr" type="submit">
                      Guardar
                    </button>
                  </form>
                  <button className="btn-tx" onClick={toggleTxt}>
                    Cancelar
                  </button>
                </div>
              )}
              {showTxt2 && (
                <div className="txr">
                <form onSubmit={saveEditedTask}>
                  <textarea
                    className="input-txr"
                    type="text"
                    placeholder="Editar descripción"
                    onChange={handleEditChange}
                    value={editingDescription}
                  />
                    <button className="btn-txr" type="submit">
                      Guardar
                    </button>
                  </form>
                  <button className="btn-tx" onClick={toggleTxt2}>
                    Cancelar
                  </button>
                </div>
              )}
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
                        <label className="lb-mv">Mover tarjeta</label>
                        <span className="material-symbols-outlined">close</span>
                      </div>
                      <label className="lb-mv">Sugerencias</label>
                      <button className="btn-mv">
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                        Hecho
                      </button>
                      <label className="lb-dt">Seleccionar destino</label>
                      <div className="mv-dt">
                        <label className="lb-lt">Lista</label>
                        <select className="slt-mv">
                          <option className="option">Tareas por hacer</option>
                          <option className="option">Tareas en progreso</option>
                          <option className="option">Tareas realizadas</option>
                          <option className="option">Tareas entregadas</option>
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
        {columns.map((column) => (
          <div
            className="column column--4"
            key={column._id}
            onDrop={(evt) => onDrop(evt, column._id)}
            onDragOver={draggingOver}
          >
            <h3 className="h3-drag">{column.titlecolunm}</h3>
            <div
              className="dd-zone"
              droppable="true"
              onDragOver={draggingOver}
              onDrop={(evt) => onDrop(evt, column._id)}
            >
              {getList(column._id).map((item) => (
                <div
                  className="dd-element"
                  key={item._id}
                  draggable
                  onDragStart={(evt) => startDrag(evt, item, column._id)}
                  onClick={() => toggleCard(item.list)}
                >
                  <strong className="title">
                    {item.title || "Sin título"}
                  </strong>
                  <span className="edit-drag">
                    <span className="material-symbols-outlined">edit</span>
                  </span>
                  <p className="body">{item.body}</p>
                </div>
              ))}
            </div>
            {!showForm[column._id] && (
              <button
                className="btn-drag"
                onClick={() => toggleForm(column._id)}
              >
                <span className="material-symbols-outlined"> add </span> Crear
                tarjeta
              </button>
            )}
            {showForm[column._id] && (
              <div className="prueba">
                <form onSubmit={handleSubmit}>
                  <input
                    className="input-drag"
                    type="text"
                    placeholder="Introduzca un título para esta tarjeta"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                  <button className="btn-dragC" type="submit">
                    Agregar tarjeta
                  </button>
                  <button
                    className="btn-closet"
                    onClick={() => toggleForm(column._id)}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Createcard;
