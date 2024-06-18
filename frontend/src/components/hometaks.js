import React from 'react'
import { NavLink } from "react-router-dom";
import TareasPage from '../TareasPage';


const hometaks = () => {
    return(
        <>
        <TareasPage/>
        <div></div>
        {/* <div className="containe">
        <div className="informacion">
          <h1>Class On Time</h1>
          <span>Crea, Desarrolla, Organiza y Despeja</span>
        </div>
      </div>
     
      <div className="prueba">
      <NavLink exact to="/Education">
        <div className="tarjeta">
          <span className="material-symbols-outlined"> history_edu </span>
          <h3>EDUCATION</h3>
          <span>Aqui podras tener acceso a infomacion de tus tareas</span>
        </div>
        </NavLink>

        <NavLink exact to="/mythings">
          <div class="tarjeta">
            <span class="material-symbols-outlined"> person </span>
            <h3>MIS COSAS</h3>
            <span>Aqui podras tener acceso a infomacion de tus cosas</span>
          </div>
        </NavLink>
        
        <NavLink exact to="/myjob">
        <div class="tarjeta">
          <span class="material-symbols-outlined"> taunt </span>
          <h3>MI TRABAJO</h3>
          <span>Aqui podras tener acceso a infomacion de tus trabajo</span>
        </div>
      </NavLink>
      </div> */}
      </>
    );
};

export default hometaks;