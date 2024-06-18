import React, { Fragment, useEffect, useState } from "react";
import TareasPage from "../TareasPage";
import { Link } from "react-router-dom";
import icons from "../asset/img/bin.png";
import edit from "../asset/img/edit.png";
import "../style/styles_card.css";
import { getTasks } from "./Education";

const backend = process.env.REACT_APP_BACKEND;

const Education = () => {
  const [tasks, setTasks] = useState([]);
  const [editedTask, setEditedTask] = useState(null);
  const [message, setMessage] = useState("");

  const getTasks = async () => {
    const res = await fetch(`${backend}/tasks`);
    if (res.status === 401) {
      console.log("Unauthorized");
      return;
    }
    const data = await res.json();
    
    setTasks(data);
  };
  const getEducationTasks = () => {
    return tasks.filter((task) => task.guy === "Education");
  };

  // const getTasks = async () => {
  //   const res = await fetch(`${backend}/tasks`);
  //   if (res.status === 401) {
  //     console.log("Unauthorized");
  //     return;
  //   }
  //   const data = await res.json();
  //   setTasks(data);
  // };

  const deleteTask = async (id) => {
    try {
      const userResponse = window.confirm(
        "¿Estás seguro de que quieres eliminarlo?"
      );
      if (userResponse) {
        const res = await fetch(`${backend}/tasks/${id}`, {
          method: "DELETE",
        });
        await getTasks();
        const data = await res.json();
        setMessage(data.msg);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const editTask = (task) => {
    setEditedTask(task);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const saveEditedTask = async () => {
    try {
      const response = await fetch(`${backend}/tasks/${editedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTask),
      });

      const data = await response.json();

      if (response.status === 200) {
        await getTasks();
        setEditedTask(null);

        // Actualizar el estado de la notificación con el mensaje del backend
        setMessage(data.msg);
      } else {
        // En caso de error, mostrar un mensaje de error genérico
        setMessage("Error al editar la tarea");
      }
    } catch (error) {
      console.error("Error al editar la tarea:", error);
      // En caso de error, mostrar un mensaje de error genérico
      setMessage("Error al editar la tarea");
    }
  };

  // const saveEditedTask = async () => {

  //   await fetch(`${backend}/tasks/${editedTask._id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(editedTask),
  //   });
  //   await getTasks();
  //   setEditedTask(null);

  // };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Fragment>
      <TareasPage />
      <h1 className="titulo">Educación</h1>
      <div className="tareas-T">
        {getEducationTasks().map((task) => (
          <div className="card-card" key={task._id}>
            <div className="date-time-container">
              <time className="date-time" dateTime={task.date}>
                <span>{new Date(task.date).getFullYear()}</span>
                <span className="separator">-</span>
                <span>
                  {new Date(task.date).toLocaleDateString("default", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </time>
            </div>
            <div className="content">
              {editedTask && editedTask._id === task._id ? (
                <div className="infos-card">
                  
                  <label>title *</label>
                  <input
                    type="text"
                    name="nameTasks"
                   className="iput"
                    value={editedTask.nameTasks}
                    onChange={handleEditChange}
                  />
                  <label>description *</label>
                  <textarea
                    name="description"
                    className="textare"
                    value={editedTask.description}
                    onChange={handleEditChange}
                  />
                  
                  <div className="icons">
                    <button className="button" onClick={saveEditedTask}>Update</button>
                    
                  </div>
                </div>
                
                
              ) : (
                <>
                  <div className="infos">
                    <a href="#">
                      <span className="title-title">{task.nameTasks}</span>
                    </a>
                    <p className="description-description">{task.description}</p>
                  </div>
                  <div className="icons">
                    <Link className="action">
                      <span className="material-symbols-outlined">check_box</span>
                    </Link>
                    <Link className="action" onClick={() => editTask(task)}>
                      <span className="material-symbols-outlined">edit_note</span>
                    </Link>
                    <Link className="action" onClick={() => deleteTask(task._id)}>
                      <span className="material-symbols-outlined">delete</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    
      
    </Fragment>
  );
};

export default Education;
