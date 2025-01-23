import React, { useEffect, useState } from "react";
import "../style/perfil.css";
import { Link, useParams } from "react-router-dom";
import Menu2 from "./Menu2";
import Menu3 from "./Menu3";

const backend = process.env.REACT_APP_BACKEND;

const DecriptionEditor = () => {
  const [nameuser, setNameuser] = useState(""); // Maneja solo el nombre de usuario
  const [email, setEmail] = useState(""); // Maneja el email del usuario
  const [showUser, setShowUser] = useState(false);
  const [userperfil, setUserperfil] = useState({
    created_user: [],
    shared_user: [],
  });

  const { id } = useParams(); // Obtén el ID del usuario

  const handletitleUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backend}/user-profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: nameuser }), // Envía solo el nombre de usuario
      });

      const data = await response.json();

      if (response.ok) {
        setShowUser(false);
        getUser(); // Refresca los datos
      } else {
        console.error("Error updating username:", data.error);
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleEditUser = () => {
    if (userperfil.created_user) {
      const currentUser = userperfil.created_user.find((user) => user._id === id);
      if (currentUser) {
        setNameuser(currentUser.username); // Carga el nombre actual
      }
    }
    toggleUser();
  };

  const getUser = async () => {
    try {
      const res = await fetch(`${backend}/user-profile`);
      if (res.status === 401) {
        console.log("Unauthorized");
        return;
      }
      const data = await res.json();

      // Configura el estado con los datos del usuario
      setUserperfil({
        created_user: data.created_user || [], // Garantiza un array
        shared_user: data.shared_user || [],
      });

      setNameuser(data.username || ""); // Establece el nombre del usuario
      setEmail(data.email || ""); // Establece el email del usuario
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const toggleUser = () => {
    setShowUser(!showUser);
  };

  return (
    <>
      <Menu3 />
      <div className="card-user">
        <div className="perfil-user">
          <span id="icons-user" className="material-symbols-outlined">
            person
          </span>
          <span onClick={handleEditUser} className="title-user">
            {nameuser || "Nombre de Usuario"}
          </span>
          <span className="title-email">{email || "Email no disponible"}</span>
          <Link to="/privatepassword">
            <span className="user-password">Reset password</span>
          </Link>
        </div>
        {showUser && (
          <div className="div-nameboard">
            <form onSubmit={handletitleUser}>
              <input
                type="text"
                name="username"
                autoComplete="off"
                onChange={(e) => setNameuser(e.target.value)} // Actualiza el valor
                value={nameuser}
              />
              <button className="btn-title" type="submit">
                Guardar
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default DecriptionEditor;
