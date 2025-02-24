import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import "../style/carddrag1.css";
import "../style/shareuser.css";
import "../style/carddrag.css";
import TareasPage from "../TareasPage";
import Authenticate from "./Authenticate";
import ToastNotification, { showToast } from "./ToastNotification";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { es } from "date-fns/locale";
import "../style/add_tareas.css";

const Createcard = ({ setIsAuthenticated }) => {
  const [showForm, setShowForm] = useState({});
  const [showCard, setShowCard] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showFh, setShowFh] = useState(false);
  const [showMover, setShowMover] = useState(false);
  const [showTxt, setShowTxt] = useState(false);
  const [showTxt2, setShowTxt2] = useState(false);
  const [showCarduser, setShowCarduser] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptions, setDescriptions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [editedTask, setEditedTask] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [user, setUser] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // const [id, setId] = useState("");
  const { id } = useParams();

  const [taskId, setTaskId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const backend = process.env.REACT_APP_BACKEND;

  useEffect(() => {
    fetchColumns();
    fetchTasks();
    // fetchDescription();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchColumns();
        await fetchTasks();
        // await fetchDescription();
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  const fetchColumns = async () => {
    try {
      const response = await fetch(`${backend}/board/${id}/column`);
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error("Error fetching columns:", error);
      showToast("Error al cargar columnas", "error");
    }
  };

  const fetchDescription = async (cardId) => {
    if (!cardId) {
      console.error("No cardId provided");
      return;
    }

    try {
      const response = await fetch(`${backend}/description/${cardId}`);
      const data = await response.json();

      if (data.length > 0) {
        // Usar solo la primera descripción si está disponible
        setDescriptions(data);
        setDescription(data[0].description || ""); // Ajusta la primera descripción al estado de `description`
      } else {
        setDescriptions([]); // Asegúrate de limpiar el estado si no hay descripciones
        setDescription("");
        console.log("No description found");
      }
    } catch (error) {
      console.error("Error fetching descriptions:", error);
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
        showToast("Error al cargar las tareas", "error");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      showToast("Error al cargar las tareas", "error");
    }
  };

  const filterTasksByCard = (cardId) => {
    return tasks.filter((task) => task._id === cardId);
  };

  const handleCardClick = (cardId) => {
    if (taskId !== cardId) {
      setTaskId(cardId);
      const filteredTasks = filterTasksByCard(cardId);
      setFilteredTasks(filteredTasks);
      setDescriptions([]); // Limpia las descripciones anteriores
      setDescription(""); // Resetea la descripción
      fetchDescription(cardId);

      const newUrl = `${location.pathname}?cardId=${cardId}`;
      navigate(newUrl, { replace: true });
      setShowCard(true);
    } else {
      setShowCard(true);
    }
  };

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setEmail("");
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
    const dropTargetIndex = Number(evt.target.dataset.index); // Nuevo: índice del elemento sobre el cual se soltó
    const itemIndex = tasks.findIndex((item) => item._id === itemID);

    if (itemIndex !== -1) {
      const updatedTasks = [...tasks];
      const updatedItem = { ...tasks[itemIndex], list };

      if (startColumn === list) {
        // Movimiento vertical dentro de la misma columna
        const columnTasks = getList(list);
        const draggedItem = columnTasks.find((item) => item._id === itemID);
        columnTasks.splice(columnTasks.indexOf(draggedItem), 1); // Elimina la tarjeta de la posición anterior
        columnTasks.splice(dropTargetIndex, 0, draggedItem); // Añade la tarjeta a la nueva posición

        // Actualiza las posiciones
        columnTasks.forEach((item, index) => {
          const taskIndex = updatedTasks.findIndex((t) => t._id === item._id);
          updatedTasks[taskIndex].position = index;
        });
      } else {
        // Movimiento horizontal (ya implementado)
        updatedTasks.splice(itemIndex, 1);
        updatedItem.position = getList(list).length; // Añadir al final de la nueva columna
        updatedTasks.push(updatedItem);

        // Reordenar las posiciones en ambas columnas
        getList(startColumn).forEach((item, index) => {
          const taskIndex = updatedTasks.findIndex((t) => t._id === item._id);
          updatedTasks[taskIndex].position = index;
        });
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
      if (editedTask) {
        // **Editar una descripción existente**
        console.log("Editing description for card ID:", taskId);

        const res = await fetch(`${backend}/description/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description }),
        });

        if (res.status === 200) {
          const data = await res.json();
          console.log("Description updated:", data);
          setEditedTask(null);
          setShowTxt(false);
          fetchDescription(taskId);
          showToast("Descripción actualizada correctamente", "success");
        }
      } else if (taskId) {
        // **Agregar descripción si no existe**
        console.log("Adding description to existing card ID:", taskId);

        // const checkRes = await fetch(
        //   `${backend}/description?card_id=${taskId}`
        // );
        const checkRes = await fetch(`${backend}/description/${taskId}`);
        if (checkRes.status === 200) {
          const existingData = await checkRes.json();
          if (existingData.length > 0) {
            showToast(
              "La descripción ya existe, no se puede crear otra.",
              "warning"
            );
            return;
          }
        }

        const res = await fetch(`${backend}/description`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description, card_id: taskId }),
        });

        if (res.status === 200) {
          const data = await res.json();
          console.log("Description created:", data);
          setShowTxt(false);
          fetchDescription(taskId);
          showToast("Descripción agregada correctamente", "success");
        }
      } else {
        // **Crear nueva tarjeta**
        console.log("Creating a new card...");
        const res = await fetch(`${backend}/card`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            list: selectedColumn,
            position: getList(selectedColumn).length,
            board_id: id,
          }),
        });

        if (res.status === 200) {
          const data = await res.json();
          console.log("Card created:", data);
          clearFields();
          fetchTasks();
          setShowForm((prev) => ({ ...prev, [selectedColumn]: false }));
          showToast("Tarjeta creada correctamente", "success");
        }
      }
    } catch (error) {
      console.error("Error during submit:", error);
      showToast("Error al realizar la operación", "error");
    }
  };

  const editTask = async () => {
    if (!taskId) return;

    try {
      const res = await fetch(`${backend}/description/${taskId}`);
      const data = await res.json();

      // Verifica y usa la primera descripción si existe
      if (data && data[0]) {
        setDescription(data[0].description);
        setEditedTask(true);
        setShowTxt(true);
        showToast("Descripción cargada exitosamente.", "success");
      } else {
        console.error("No description found for the selected task");
        showToast(
          "No se encontró una descripción para la tarea seleccionada.",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error fetching task description:", error);
      showToast("Error al cargar la descripción.", "error");
    }
  };

  const deleteTask = async () => {
    try {
      const userResponse = window.confirm(
        "¿Estás seguro de que quieres eliminarlo?"
      );
      if (userResponse) {
        const res = await fetch(`${backend}/card/${taskId}`, {
          method: "DELETE",
        });
        await fetchTasks();
        const data = await res.json();
        console.log(data);
        setShowCard(false);
        setTaskId(null);
        showToast("Tarea eliminada exitosamente.", "success");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showToast("Error al eliminar la tarea.", "error");
    }
  };

  const toggleCard = () => {
    if (showCard) {
      // Si la tarjeta ya está abierta, al cerrarla se elimina el ID de la barra de búsqueda
      const newUrl = location.pathname;
      navigate(newUrl, { replace: true });
      setTaskId(null); // Resetea el estado de taskId
    }
    setShowCard(!showCard);
  };

  const toggleUser = () => {
    setShowUser(!showUser);
  };
  const toggleFh = () => {
    setShowFh(!showFh);
  };

  const toggleMover = () => {
    setShowMover(!showMover);
  };
  const toggleTxt = () => {
    if (descriptions.length > 0) {
      const firstDescription = descriptions[0];
      editTask(firstDescription._id);
    } else {
      setEditedTask(false);
      setDescription("");
      setShowTxt(!showTxt);
    }
  };
  const cancelEditing = () => {
    setShowTxt(!showTxt);
    setEditedTask(false);
    setDescription("");
  };
  // const toggleTxt = () => {
  //   setShowTxt(!showTxt);
  // };
  const toggleTxt2 = () => {
    setShowTxt2(!showTxt2);
  };

  const toggleCarduser = () => {
    setShowCarduser(!showCarduser);
  };

  const handleShareuser = async (e) => {
    e.preventDefault();
    if (!id) {
      showToast("No se proporcionó el ID del tablero.", "warning");
      return;
    }

    try {
      const res = await fetch(`${backend}/board/${id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        clearFields();
        showToast("Usuario compartido exitosamente.", "success");
        // getShare();
      } else {
        showToast("Error al compartir el usuario.", "error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showToast("Error de conexión al intentar compartir el usuario.", "error");
    }
  };

  const handleTitle = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backend}/card/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      });
      if (response.status === 200) {
        clearFields();
        setShowTxt2(false);
        fetchTasks();
        showToast("Título actualizado exitosamente.", "success");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showToast("Error al actualizar el título.", "error");
    }
  };
  const handleEditTitle = () => {
    const currentTask = tasks.find((task) => task._id === taskId);
    if (currentTask) {
      setTitle(currentTask.title); // Cargar el título actual en el estado
    }
    toggleTxt2();
    // Mostrar el campo de entrada
  };
  const handleMoveCard = async () => {
    if (!taskId || !selectedColumn) {
      alert("Por favor selecciona una columna válida.");
      showToast("Por favor selecciona una columna válida.", "warning");
      return;
    }

    try {
      const updatedCard = {
        list: selectedColumn, // Nueva columna
        position: getList(selectedColumn).length, // Actualiza la posición al final de la lista seleccionada
      };

      // Llamada al backend para actualizar la tarjeta
      const res = await fetch(`${backend}/card/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCard),
      });

      if (res.status === 200) {
        console.log("Card moved successfully!");
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, list: selectedColumn } : task
        );
        setTasks(updatedTasks); // Actualiza las tareas en el frontend
        setShowMover(false); // Cierra el modal de mover
        showToast("Tarjeta movida exitosamente.", "success");
      } else {
        console.error("Error moving card:", await res.text());
        showToast("Error al mover la tarjeta.", "error");
      }
    } catch (error) {
      console.error("Error moving card:", error);
      showToast("Error al mover la tarjeta.", "error");
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(`${backend}/board/${id}/user-role`);
        if (res.ok) {
          const data = await res.json();
          setSelectedRole(data.role);
        } else {
          console.error("Error al obtener el rol del usuario");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };
    fetchRole();
  }, [id, backend]);

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reinicia la altura para recalcular
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura al contenido
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`${backend}/board/${id}/shared-users`);
      if (res.status === 401) {
        console.log("Unauthorized");
        return;
      }
      const data = await res.json();
      setUser(data);
     
    };

    getUser();
  }, [id, backend]);
  const colors = ["#494ce7", "#e53232", "#047c24", "#f39c12", "#8e44ad", "#16a085"];
  return (
    <>
      <ToastNotification />
      <Authenticate setIsAuthenticated={setIsAuthenticated} />
      <TareasPage fetchColumns={fetchColumns} selectedRole={selectedRole} />

      {selectedRole === "administrador" && (
        <button className="prueba-btn" onClick={toggleCarduser}>
          <span className="material-symbols-outlined"> person_add </span>
          <span className="lable">Compartir</span>
        </button>
      )}

      {showCarduser && (
        <div className="cont-form">
          <div className="cont-frm">
            <form className="form" onSubmit={handleShareuser}>
              <div className="note">
                <label className="title">Compartir tablero</label>
                <span className="subtitle">
                  Aqui puedes invitar nuevo usuarios a usar tu tablero con
                  varios roles: observador, miembro, administrador
                </span>
              </div>
              <div className="information">
                <input
                  type="email"
                  placeholder="Direccion de correo electronico"
                  className="input_field"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <select
                  id="tipos"
                  className="select"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                >
                  <option value="">roles</option>
                  <option value="miembro">Miembro</option>
                  <option value="observador">Observador</option>
                  <option value="administrador">Administrador</option>
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
              <div className="jaja">
                <h2
                  onClick={
                    selectedRole === "administrador" ? handleEditTitle : null
                  }
                >
                  {tasks.find((task) => task._id === taskId)?.title ||
                    "Título no disponible"}
                </h2>
              </div>

              {showTxt2 && (
                <div className="div-title">
                  <form onSubmit={handleTitle}>
                    <textarea
                      className="textareas"
                      onInput={handleInput}
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                    <button className="btn-title">guardar</button>
                  </form>
                </div>
              )}
              <div className="cont-dct">
                <h3 className="h3-dct">
                  <span className="material-symbols-outlined">subject</span>
                  Descripción
                </h3>
                {/* {descriptions.map((description) => ( */}
                {/* {descriptions
                  .filter((description) => description.cardId === taskId) // Filtrar por el taskId actual
                  .map((description) => ( */}
                {(selectedRole === "administrador" ||
                  selectedRole === "miembro") &&
                  descriptions.map((description) => (
                    <button
                      className="btn-dct"
                      onClick={() => editTask(description._id)}
                      key={description._id}
                    >
                      Editar
                    </button>
                  ))}

                <div className="pt-dct">
                  {!showTxt && (
                    <button
                      className="btn-dc"
                      onClick={
                        selectedRole === "administrador" ||
                        selectedRole === "miembro"
                          ? toggleTxt
                          : null
                      }
                    >
                      {descriptions.length === 0 ? (
                        <span className="span-dct">
                          {"Descripción guardada en la tarjeta"}
                        </span>
                      ) : (
                        descriptions.map((description) => (
                          <span className="span-dct" key={description._id}>
                            {description.description}
                          </span>
                        ))
                      )}
                    </button>
                  )}
                  <div className="user-ne">
                    <label className="user-lb">Miembros del tablero : </label>

                    {user.length > 0 ? (
                      user.map((usr) => (
                        <span key={usr.username} className="user-name">
                          {usr.username}
                        </span>
                      ))
                    ) : (
                      <span className="sp-mb">No hay miembros</span>
                    )}
                  </div>
                  <div className="cont-fh">
                    <label className="sp-fh">Fecha :</label>
                    {filteredTasks.map((task) => (
                      <span className="fh" key={task._id}>
                        {task.created_at}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {showTxt &&
                (selectedRole === "administrador" ||
                  selectedRole === "miembro") && (
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
                        {editedTask ? "Update" : "Create"}
                      </button>
                    </form>
                    <button className="btn-tx" onClick={cancelEditing}>
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

                      <label className="lb-mb">
                        Miembros del tablero Email :
                      </label>
                      {user.length > 0 ? (
                        user.map((usr) => (
                          <span key={usr.email} className="sp-mb">
                            {usr.email}
                          </span>
                        ))
                      ) : (
                        <span className="sp-mb">No hay miembros</span>
                      )}
                    </div>
                  </li>
                )}

                <li className="li" onClick={toggleFh}>
                  <span className="material-symbols-outlined">schedule</span>
                  Fecha
                </li>

                {showFh && (
                  <li>
                    <div className="card-fh">
                      <div className="fh-usr" onClick={toggleFh}></div>
                      <div className="fh-calendar">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={es}
                          className="small-calendar"
                        />
                      </div>
                      <div className="dates-list">
                        <h3>Fechas creadas:</h3>
                        <ul>
                          {filteredTasks.map((task) => (
                            <li key={task._id}>{task.created_at}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                )}
                {(selectedRole === "administrador" ||
                  selectedRole === "miembro") && (
                  <>
                    <li className="li" onClick={toggleMover}>
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                      Mover
                    </li>
                    <li className="li" onClick={() => deleteTask(tasks._id)}>
                      <span className="material-symbols-outlined">delete</span>
                      Eliminar tarjeta
                    </li>
                  </>
                )}

                {showMover && (
                  <li>
                    <div className="card-mv">
                      <div className="pst-mv" onClick={toggleMover}>
                        <label className="lb-mv">Mover tarjeta</label>
                        <span className="material-symbols-outlined">close</span>
                      </div>
                      <label className="lb-mv">Sugerencias</label>
                      <button className="btn-mv" onClick={handleMoveCard}>
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                        Hecho
                      </button>

                      <label className="lb-dt">Seleccionar destino</label>

                      <div className="mv-dt">
                        <label className="lb-lt">Lista</label>
                        <select
                          className="slt-mv"
                          value={selectedColumn}
                          onChange={(e) => setSelectedColumn(e.target.value)}
                        >
                          <option value="">Selecione una Columna</option>

                          {columns.map((column) => (
                            <option
                              className="option"
                              key={column._id}
                              value={column._id}
                            >
                              {column.titlecolumn}
                            </option>
                          ))}
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
        {columns.map((column,index) => (
          <div
            className="column"
            key={column._id}
            style={{ borderColor: colors[index % colors.length] }}
            onDrop={(evt) => onDrop(evt, column._id)}
            onDragOver={draggingOver}
            // onClick={() => handleCardClick(column._id)}
          >
            <h3 className="h3-drag">{column.titlecolumn}</h3>
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
                  // onClick={() => toggleCard(item.list)}
                  onClick={() => handleCardClick(item._id)}
                  data-index={getList(column._id).indexOf(item)}
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
            {!showForm[column._id] &&
              (selectedRole === "administrador" ||
                selectedRole === "miembro") && (
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
                  <textarea
                    className="input-drag"
                    type="text"
                    maxLength="64"
                    required
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
