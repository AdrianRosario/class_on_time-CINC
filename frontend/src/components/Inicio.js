import React from "react";
import Menu from "./Menu";
import "../style/home.css";
import { NavLink } from "react-router-dom";


const Inicio = () => {
  return (
      <div id="prueb">
        <>
          <Menu />
          
          <div className="container">
            <div className="card">
              <ul>
                <li>
                  <h1>Class On Time</h1>
                  <br />
                  <span>Private Page</span>
                </li>
                <li>
                  <p>
                    Class on time Concéntrate, organízate y trae calma a tu vida
                    con La aplicación de listas y gestión de tareas, gestión
                    trabajo, gestión de mi cosas y tambien cuenta con la mejor
                    seguridad para tus datos
                  </p>
                </li>
                <li>
                  <NavLink to="/registro">
                    <button className="button-inicio">Registrarte</button>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      </div>
    );
  };
    // <div id="prueba">
    //   <>
    //     <Menu />
    //     <div id="prueba"></div>
    //     <div className="container">
    //       <div className="card">
    //         <ul>
    //           <li>
    //             <h1>Class On Time</h1>
    //             <br />
    //             <span>Private Page</span>
    //           </li>

    //           <li>
    //             <p>
    //               Class on time Concéntrate, organízate y trae calma a tu vida
    //               con La aplicación de listas y gestión de tareas, gestión
    //               trabajo, gestión de mi cosas y tambien cuenta con la mejor
    //               seguridad para tus datos
    //             </p>
    //           </li>
    //           <li>
    //             <NavLink to="/registro">
    //               <button className="button-inicio">Registrarte</button>
    //             </NavLink>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //   </>
    // </div>
 

export default Inicio;
