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
                  Organiza, colabora y gestiona tus proyectos con facilidad en
                  Class On Time En Class On Time, llevamos la gestión de tareas
                  y proyectos al siguiente nivel con una plataforma intuitiva y
                  flexible diseñada para ayudarte a organizar tu trabajo de
                  manera eficiente.<br></br> <br/>🔹 Crea tableros personalizados: Diseña
                  espacios de trabajo adaptados a tus necesidades, ya sea para
                  proyectos personales, académicos o laborales.<br/><br/> 🔹 Organiza
                  tareas en columnas: Define tu flujo de trabajo con columnas
                  dinámicas donde puedes agrupar y mover tareas según su estado
                  o prioridad.<br/><br/> 🔹 Agrega tarjetas con detalles importantes: Cada
                  tarea se representa como una tarjeta donde puedes incluir
                  descripciones detalladas, asegurando que nada se pase por
                  alto.<br/><br/> 🔹 Colabora en equipo: Comparte tableros con otros
                  usuarios y trabaja en equipo en tiempo real, manteniendo a
                  todos en la misma página. Con Class On Time, optimiza tu
                  productividad y mantén el control de tus tareas de manera
                  sencilla y eficaz. ¡Empieza hoy y experimenta una nueva forma
                  de organizar tu trabajo!
                </p>
                {/* <p>
                    Class on time Concéntrate, organízate y trae calma a tu vida
                    con La aplicación de listas y gestión de tareas, gestión
                    trabajo, gestión de mi cosas y tambien cuenta con la mejor
                    seguridad para tus datos
                  </p> */}
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
