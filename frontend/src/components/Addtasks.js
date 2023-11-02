import React, { Fragment, useState } from "react";
import TareasPage from "../TareasPage";

import "../style/add_tareas.css";


const backend = process.env.REACT_APP_BACKEND;

const Addtasks = () => {
  const [nameTasks, setNameTasks] = useState("");
  const [description, setDescription] = useState("");
  const [guy, setGuy] = useState("");
  const [date, setDate] = useState("");

  const clearFields = () => {
    setNameTasks('');
    setDescription('');
    setGuy('');
    setDate('');
  };

  const handlesubmin = async (e) => {
    e.preventDefault();

    const user_id = sessionStorage.getItem('user_id');
    const authentication_token = localStorage.getItem('authentication_token');


    const res = await fetch(`${backend}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authentication_token}`,
      },
      body: JSON.stringify({
        nameTasks,
        description,
        guy,
        date,
        user_id,
      
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log("tarea agregada", data);
      clearFields();
    }else {
      console.error("error al agregar tarea")
    }
    // const data = await res.json();
    // console.log("tarea agregada", data);
    // clearFields();
  };
  return (
    <Fragment>
      <TareasPage />
      <div className="add-tareas">
        <form className="form-add" onSubmit={handlesubmin}>
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
              <button className="button-A">Create</button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Addtasks;
