import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../style/login.css";
import ToastNotification, { showToast } from "./ToastNotification";

import Menu from "./Menu";

const backend = process.env.REACT_APP_BACKEND;

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backend}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        const token = data.access_token;
        localStorage.setItem("jwt_token", token);
        console.log(data)

        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        showToast("Inicio de sesión exitoso", "success");
        navigate("/espaciodetrabajo");
      } else {
        const errorData = await res.json();
        showToast(errorData.msg || "Credenciales incorrectas", "error");
        // setErrorMessage(errorData.msg); // Actualiza el estado con el mensaje de error
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
    }
  };
  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch(`${backend}/get-google-auth-url`);
  //     if (response.status === 200) {
  //       const data = await response.json();
  //       if (data.url) {
  //         window.location.href = data.url;
  //       } else {
  //         throw new Error("URL de autenticación no proporcionada");
  //       }
  //     } else {
  //       showToast(
  //         "Error al obtener la URL de autenticación de Google",
  //         "error"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error durante el login con Google:", error);
  //     showToast("Ocurrió un error durante la autenticación", "error");
  //   }
  // };
  
  const handleLogin = async () => {
    try {
      const response = await fetch(`${backend}/get-google-auth-url`);

      if (response.status === 200) {
        const data = await response.json();
        window.location.href = data.url;

        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        showToast("Redirigiendo para iniciar sesión con Google", "success");
        navigate("/espaciodetrabajo");
      } else {
        showToast(
          "Error al obtener la URL de autenticación de Google",
          "error"
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      showToast("Ocurrió un error en el servidor", "error");
    }
  };

  return (
    <>
      <Menu />
      <ToastNotification />
      <div className="overlay">
  <div className="form-container">
    <p className="title">Iniciar sesión en Class on Time</p>
    <form onSubmit={handleSubmit} className="form">
      <input
        type="email"
        id="txt-input"
        className="input"
        placeholder="Correo electrónico"
        required=""
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        className="input"
        placeholder="Contraseña"
        required=""
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <p className="page-link">
        <Link to="/resetpassword">
          <span className="page-link-label">¿Olvidaste tu contraseña?</span>
        </Link>
      </p>
      <button className="form-btn">Iniciar sesión</button>
    </form>
    <p className="sign-up-label">
      ¿No tienes una cuenta?{" "}
      <Link to="/registro">
        <span className="sign-up-link">Regístrate</span>
      </Link>
    </p>
    <br />
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
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
  c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
  c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
  C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
  c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        ></path>
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
  c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
      </svg>
      <span onClick={handleLogin}>Iniciar sesión con Google</span>
    </div>
  </div>
</div>

      {/* <div className="overlay">
        <div className="form-container">
          <p className="title">Sign in to Class on Time</p>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="email"
              id="txt-input"
              className="input"
              placeholder="Email"
              required=""
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              required=""
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <p className="page-link">
              <Link to="/resetpassword">
                <span className="page-link-label">Forgot Password?</span>
              </Link>
            </p>
            <button className="form-btn">Log in</button>
          </form>
          <p className="sign-up-label">
            Don't have an account?{" "}
            <Link to="/registro">
              <span className="sign-up-link">Sign up</span>
            </Link>
          </p>
          <br />
          <div className="google-login-button">
            <svg
              stroke="currentColor"
              fill="currentColor"
              // stroke-width="0"
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
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <span onClick={handleLogin}>Log in with Google</span>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Login;
