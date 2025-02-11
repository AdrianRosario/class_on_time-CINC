import React, { Fragment, useState } from "react";
import "../style/registro.css";
import Menu from "./Menu";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../style/google.css";
import ToastNotification, {showToast} from "./ToastNotification";

const backend = process.env.REACT_APP_BACKEND;

const Registro_U = ({ setIsAuthenticated }) => {
  const [message, setMessage] = useState("");
  const navegate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const clearFields = () => {
    setValue("username", "");
    setValue("email", "");
    setValue("password", "");
  };

  const handlesubmin = async (data) => {
    try {
      const res = await fetch(`${backend}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Enviar todo el objeto de datos
      });
      if (res.status === 200) {
        const data = await res.json();
        setMessage(data.msg);
        showToast("Registration successful!", "success");
      }else {
        showToast(data.msg, "error")
      }
     
      clearFields();
    } catch (error) {
      console.error("Error:", error);
      showToast("An error occurred while registering.", "error");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${backend}/get-google-auth-url`);

      if (response.status === 200) {
        const data = await response.json();
        window.location.href = data.url;

        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        navegate("/hometaks");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showToast("An error occurred during Google login.", "error");
    }
  };

  return (
    <Fragment>
      <Menu />
      <ToastNotification/>
      <div id="login-box">
  <div className="form-container">
    <p className="title">Crear cuenta</p>
    <p className="sub-title">Registrate en Class on Time </p>
    <form className="form" onSubmit={handleSubmit(handlesubmin)}>
      <input
        type="text"
        className="input"
        name="username"
        placeholder="Nombre de usuario"
        {...register("username", {
          required: "El nombre de usuario es obligatorio", 
          minLength: { value: 3, message: "El nombre de usuario debe tener al menos 3 caracteres" },
          maxLength: { value: 12, message: "El nombre de usuario debe tener como máximo 12 caracteres" },
          pattern: {
            value: /^[A-Z]/,
            message: "El nombre de usuario debe comenzar con una letra mayúscula",
          },
        })}
      />
      {errors.username && <p className="mgs">{errors.username.message}</p>}

      <input
        type="email"
        className="input"
        name="email"
        placeholder="Correo electrónico"
        {...register("email", {
          required: "El correo electrónico es obligatorio", 
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Por favor ingresa una dirección de correo válida",
          },
        })}
      />
      {errors.email && <p className="mgs">{errors.email.message}</p>}

      <input
        type="password"
        className="input"
        name="password"
        placeholder="Contraseña"
        {...register("password", {
          required: "La contraseña es obligatoria",
          minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" },
        })}
      />
      {errors.password && <p className="mgs">{errors.password.message}</p>}

      <button className="form-btn">Crear cuenta</button>
    </form>
    <p className="sign-up-label">
      ¿Ya tienes una cuenta?<NavLink to="/login"><span className="sign-up-link">Iniciar sesión</span></NavLink>
    </p>

    <div className="buttons-container">
      <div className="google-login-button">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          version="1.1"
          x="0px"
          y="0px"
          className="google-icon"
          viewBox="0 0 48 48"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
        <span onClick={handleLogin}>Registrarse con Google</span>
      </div>
    </div>
  </div>
</div>
<p>{message}</p>

    </Fragment>
  );
};

export default Registro_U;
