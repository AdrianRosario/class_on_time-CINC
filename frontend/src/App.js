import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import Inicio from "./components/Inicio";
import Login from "./components/Login";
import Registro_U from "./components/Registro_U";
import "./style/App.css";
import About from "./components/About";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./components/ResetPassword";
import PrivatePassword from "./components/PrivatePassword";
import Hometaks from "./components/hometaks";
import CardDrag from "./components/CardDrag";
import WorkSpace from "./components/WorkSpace";
import Menu2 from "./components/Menu2";

import DecriptionEditor from "./components/DecriptionEditor";
import Menu3 from "./components/Menu3";

const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();

  const routeTitles = {
    "/": "Inicio",
    "/login": "Iniciar Sesión",
    "/registro": "Registro",
    "/resetpassword": "Restablecer Contraseña",
    "/about": "Acerca de",
    "/board/:id": "Tablero",
    "/createcard": "Crear Tarjeta",
    "/espaciodetrabajo": "Espacio de Trabajo",
    "/Menu2": "Menú 2",
    "/perfil-user": "Perfil de Usuario",
    "/Menu3": "Menú 3",
    "/hometaks": "Inicio de Tareas",
    "/privatepassword": "Contraseña Privada",
  };

  useEffect(() => {
    const path = location.pathname;
    const dynamicTitle = Object.keys(routeTitles).find((route) =>
      new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`).test(path)
    );
    document.title = `${routeTitles[dynamicTitle] || "Página"} - Mi Aplicación`;
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route
        path="/login"
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route path="/registro" element={<Registro_U setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/about" element={<About setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/board/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><CardDrag setIsAuthenticated={setIsAuthenticated}/></PrivateRoute>} />
      <Route path="/espaciodetrabajo" element={<PrivateRoute isAuthenticated={isAuthenticated}><WorkSpace setIsAuthenticated={setIsAuthenticated}/></PrivateRoute>} />
      <Route path="/Menu2" element={<PrivateRoute isAuthenticated={isAuthenticated}><Menu2 /></PrivateRoute>} />
      <Route path="/perfil-user" element={<PrivateRoute isAuthenticated={isAuthenticated}><DecriptionEditor /></PrivateRoute>} />
      <Route path="/Menu3" element={<PrivateRoute isAuthenticated={isAuthenticated}><Menu3 /></PrivateRoute>} />
      <Route path="/hometaks" element={<PrivateRoute isAuthenticated={isAuthenticated}><Hometaks /></PrivateRoute>} />
      <Route path="/privatepassword" element={<PrivateRoute isAuthenticated={isAuthenticated}><PrivatePassword /></PrivateRoute>} />
    </Routes>
  );
};

function App() {
  const initialAuthenticatedStatus =
    localStorage.getItem("isAuthenticated") === "true";
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticatedStatus);

  return (
    <Fragment>
      <Router>
        <AppContent
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </Router>
    </Fragment>
  );
}

export default App;
