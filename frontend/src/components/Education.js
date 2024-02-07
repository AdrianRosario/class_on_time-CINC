import React, { Fragment, useEffect, useState } from "react";
import TareasPage from "../TareasPage";
import { Link } from "react-router-dom";
import icons from "../asset/img/bin.png";
import edit from "../asset/img/edit.png";
import '../style/styles_card.css'

const backend = process.env.REACT_APP_BACKEND;

const Education = () => {
  const [tasks, setTasks] = useState([]);
  const [editedTask, setEditedTask] = useState(null);

  const getTasks = async () => {
    const res = await fetch(`${backend}/tasks`);
    if (res.status === 401) {
      console.log("Unauthorized");
      return;
    }
    const data = await res.json();
    setTasks(data);
  };

  const deleteTask = async (id) => {
    const userResponse = window.confirm(
      "¿Estás seguro de que quieres eliminarlo?"
    );
    if (userResponse) {
      await fetch(`${backend}/tasks/${id}`, {
        method: "DELETE",
      });
      await getTasks();
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
    await fetch(`${backend}/tasks/${editedTask._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedTask),
    });
    await getTasks();
    setEditedTask(null);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Fragment>
      <TareasPage />
      <h1 className="titulo">Educacion</h1>
      <div className="tareas-T">
        {tasks.map((task) => (
          <div className="add-T" key={task._id}>
            <header className="header-T">
              {editedTask && editedTask._id === task._id ? (
                <input
                
                  type="text"
                  name="nameTasks"
                  value={editedTask.nameTasks}
                  onChange={handleEditChange}
                />
              ) : (
                <span className="span-T">{task.nameTasks}</span>
              )}
              {editedTask && editedTask._id === task._id ? (
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleEditChange}
                />
              ) : (
                <p className="description-T">{task.description}</p>
              )}
              {editedTask && editedTask._id === task._id ? (
                <input
                name="date"
                type="date"
                onChange={handleEditChange}
                value={editedTask.date}
              />
              ):(
                <div className="tiempo">
                <span>{task.date}</span>
                </div>
              )}

            </header>
             
            <div className="icons-T">
              {editedTask && editedTask._id === task._id ? (
                <button onClick={saveEditedTask}>Guardar</button>
              ) : (
                <>
                  <Link className="link" onClick={() => deleteTask(task._id)}>
                    <img src={icons} alt="" />
                  </Link>
                  <Link className="link" onClick={() => editTask(task)}>
                    <img src={edit} alt="" />
                  </Link>
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


