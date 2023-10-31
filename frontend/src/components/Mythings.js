import React, { Fragment } from "react";
import TareasPage from "../TareasPage";
import { Link } from "react-router-dom";
import icons from "../asset/img/bin.png";
import edit from "../asset/img/edit.png";
import "../style/styles_card.css";


const Mythings = () => {
  return (
    <Fragment>
      <TareasPage />
      <h1 className="titulo">Mi Cosas</h1>
      <div className="tareas-T">
        <div className="add-T">
          <header className="header-T">
            <span className="span-T"> Cosinar Temprano</span>
            <p className="description-T">
              para que lo jovens puedan comer y asi salir temprno a trabajar
            </p>
          </header>
          <div className="tiempo">
            <span>29 / 08 /2023</span>
          </div>
          <div className="icons-T">
            <Link className="link">
              <img src={icons} alt="" />
            </Link>
            <Link className="link">
              <img src={edit} alt="" />
            </Link>
          </div>
        </div>
      </div>

      <div className="tareas-T">
        <div className="add-T">
          <header className="header-T">
            <span className="span-T"> Cosinar Temprano</span>
            <p className="description-T">
              para que lo jovens puedan comer y asi salir temprno a trabajar
            </p>
          </header>
          <div className="tiempo">
            <span>29 / 08 /2023</span>
          </div>
          <div className="icons-T">
            <Link className="link">
              <img src={icons} alt="" />
            </Link>
            <Link className="link">
              <img src={edit} alt="" />
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Mythings;
