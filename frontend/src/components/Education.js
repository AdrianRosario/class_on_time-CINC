import React, { Fragment, useEffect, useState } from "react";
import TareasPage from "../TareasPage";
import { Link } from "react-router-dom";
import icons from "../asset/img/bin.png";
import edit from "../asset/img/edit.png";
import editTasks from "./Updata";
import "../style/add_tareas.css";

const backend = process.env.REACT_APP_BACKEND;

// const {editTasks} = Updata();

const Education = () => {
  const [tasks, setTasks] = useState([]);
  // const [nameTasks, setNameTasks] = useState("");
  // const [description, setDescription] = useState("");
  // const [guy, setGuy] = useState("");
  // const [date, setDate] = useState("");

  // const [id, setId] = useState("");
  // const user = JSON.parse(localStorage.getItem("user"));



  const getTasks = async () => {
    const res = await fetch(`${backend}/tasks`);

    if (res.status === 401) {
      console.log("Unauthorized");
      return;
    }

    const data = await res.json();
    setTasks(data);
    console.log(data);
  };

  const deleteUser = async (id) => {
    const userResponse = window.confirm("Are you sure you want to delete it?");
    if (userResponse) {
      const res = await fetch(`${backend}/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      await getTasks();
    }
  };

  // const editTasks = async (id) => {
  //   const res = await fetch(`${backend}/tasks/${id}`);

  //   const data = await res.json();

  //   setNameTasks(data.nameTasks);
  //   setDescription(data.description);
  //   setDate(data.date);
  //   setGuy(data.guy);
  //   setId(id);

  //   await getTasks();
  
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const editedTask = {
  //     nameTasks,
  //     description,
  //     date,
  //     guy,
  //   };

  //   const res = await fetch(`${backend}/tasks/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(editedTask),
  //   });

  //   const data = await res.json();
  //   console.log(data);
  //   await getTasks();
    
  // };

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
              <span className="span-T">{task.nameTasks}</span>
              <p className="description-T">{task.description}</p>
            </header>
            <div className="tiempo">
              <span>{task.date}</span>
            </div>
            <div className="icons-T">
              <Link className="link" onClick={(e) => deleteUser(task._id)}>
                <img src={icons} alt="" />
              </Link>
              <Link className="link" onClick={(e) => editTasks(task._id)}>
                <img src={edit} alt="" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* <div className={`add-tareas ${isFormVisible ? "form-visible" : ""}`}>
        <form className="form-add" onSubmit={handleSubmit}>
          <div className="add-tareas">
            <div className="add">
              <header className="form-head">
                <h1>Add Tareas</h1>
              </header>
              <div className="add-a">
                <label form="txt-input">Nombre de la Tarea *</label>
                <input
                  className="input-A"
                  type="text"
                  id="nombre_tareas"
                  placeholder="Add Tareas"
                  onChange={(e) => setNameTasks(e.target.value)}
                  value={nameTasks}
                  autoFocus
                  required
                />
                <label form="descripcion">Descripcion* </label>
                <textarea
                  className="textarea-A"
                  id="descripcion"
                  placeholder="Add Tareas"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  required
                />
                <label form="Date">Date*</label>
                <input
                  type="date"
                  id="date"
                  placeholder="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                />
                <label form="tipos">Tipos*</label>
                <select
                  className="select-A"
                  id="tipos"
                  onChange={(e) => setGuy(e.target.value)}
                  value={guy}
                >
                  <option>Educacion</option>
                  <option>MiCosas</option>
                  <option>MiTrabajo</option>
                </select>
                <br />
                <button className="button-A" type="submit">
                  Create
                </button>
              </div>
            </div>
          </div>
        </form>
      </div> */}
    </Fragment>
  );
};

export default Education;
