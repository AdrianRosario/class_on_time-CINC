import React, { Fragment, useEffect, useState } from "react";
import TareasPage from "../TareasPage";
import { Link } from "react-router-dom";
import icons from "../asset/img/bin.png";
import edit from "../asset/img/edit.png";

const backend = process.env.REACT_APP_BACKEND;

const Education = () => {
  const [tasks, setTasks] = useState([]);
  // const user = JSON.parse(localStorage.getItem("user"))

  const getTasks = async () => {
    
    const res = await fetch(`${backend}/tasks`);
    

    if (res.status === 401) {
      console.log("Unauthorized");
      return;
    }

    const data = await res.json();
    setTasks(data);
    console.log(data);
  
}

  useEffect(() => {
    getTasks();
  }, []);

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
              <Link className="link" onClick={(e) => deleteUser(task._id) }>
                <img src={icons} alt="" />
              </Link>
              <Link className="link">
                <img src={edit} alt="" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default Education;
