import React, { Fragment, useState } from "react";
import TareasPage from "../TareasPage";
// import { getTasks, editTasks } from "./Education";


const backend = process.env.REACT_APP_BACKEND;

const Updata = () => {
  const [nameTasks, setNameTasks] = useState("");
  const [description, setDescription] = useState("");
  const [guy, setGuy] = useState("");
  const [date, setDate] = useState("");
  const [id, setId] = useState("");

  const editTasks = async (id) => {
    const res = await fetch(`${backend}/tasks/${id}`);

    const data = await res.json();

    setNameTasks(data.nameTasks);
    setDescription(data.description);
    setDate(data.date);
    setGuy(data.guy);
    setId(id);

    // await getTasks();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const editedTask = {
      nameTasks,
      description,
      date,
      guy,
    };

    const res = await fetch(`${backend}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedTask),
    });

    const data = await res.json();
    console.log(data);
    // await getTasks();
  };
 



  return (
    <Fragment>
      <TareasPage />
      <div className="add-tareas">
        <form className="form-add" onSubmit={handleSubmit}>
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

export default Updata

