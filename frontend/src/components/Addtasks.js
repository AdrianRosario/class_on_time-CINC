import React, { Fragment, useState } from "react";
import TareasPage from "../TareasPage";
import "../style/add_tareas.css";

const backend = process.env.REACT_APP_BACKEND;

const Addtasks = () => {
  const [nameTasks, setNameTasks] = useState("");
  const [description, setDescription] = useState("");
  const [guy, setGuy] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const clearFields = () => {
    setNameTasks("");
    setDescription("");
    setGuy("");
    setDate("");
  };

  const handlesubmin = async (e) => {
    e.preventDefault();
    try {
      const user_id = sessionStorage.getItem("user_id");
      const authentication_token = localStorage.getItem("authentication_token");

      const res = await fetch(`${backend}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authentication_token}`,
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
        setMessage(data.message);
        clearFields();
      } else {
        const errorData = await res.json();
        setMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Fragment>
      <TareasPage />
      <div className="add-tareas">
        <form className="form-add" onSubmit={handlesubmin}>
          <div className="add">
            <header className="form-head">
              <h1 >Add Tareas</h1>
            </header>
            {message && <p>{message}</p>}
            <div className="add-a">
              <label form="txt-input">Nombre de la Tarea *</label>
              <input
                type="text"
                id="nombre_tareas"
                placeholder="Add Tareas"
                
                required
                onChange={(e) => setNameTasks(e.target.value)}
                value={nameTasks}
              />
              <label form="descripcion">Descripcion* </label>
              <textarea
                id="descripcion"
                placeholder="Add Tareas"
                required
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>

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
                id="tipos"
                onChange={(e) => setGuy(e.target.value)}
                value={guy}
              >
                <option value="">Seleccione un tipo</option>
                <option value="Education">Education</option>
                <option value="Mythings">Mythings</option>
                <option value="Myjob">Myjob</option>
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
