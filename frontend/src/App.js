import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import Inicio from "./components/Inicio";
import Login from "./components/Login";
import Registro_U from "./components/Registro_U";
import TareasPage from "./TareasPage";
import Myjob from "./components/Myjob";
import "./style/App.css";
import Education from "./components/Education";
import Addtasks from "./components/Addtasks";
import Mythings from "./components/Mythings";
import About from "./components/About";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./components/ResetPassword";
import Updata from "./components/Updata";
import PrivatePassword from "./components/PrivatePassword";
import Hometaks from "./components/hometaks";
import Shareuser from "./components/Shareuser";
import CardDrag from "./components/CardDrag";
import Createcard from "./components/Createcard";
import WorkSpace from "./components/WorkSpace";
import Menu2 from "./components/Menu2";


function App() {
  const initialAuthenticatedStatus =
    localStorage.getItem("isAuthenticated") === "true";

  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAuthenticatedStatus
  );



  
  return (
    <Fragment>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/registro" element={<Registro_U setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/resetpassword" element={<ResetPassword/>}/>
            <Route path="/about"   element={<About setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/updata" element={<Updata/>}/>
            <Route path="/carddrag" element={<CardDrag/>}/>
            <Route path="/createcard" element={<Createcard/>}/>
            <Route path="/espaciodetrabajo" element={<WorkSpace/>}/>
            <Route path="/Menu2" element={<Menu2/>}/>
           

            <Route path="/hometaks" element={<PrivateRoute isAuthenticated={isAuthenticated}><Hometaks/></PrivateRoute>}/>
            <Route path="/shareuser" element={<PrivateRoute isAuthenticated={isAuthenticated}><Shareuser/></PrivateRoute>}/>

            <Route
               exact
              path="/tareas"
              element={ 
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <TareasPage setIsAuthenticated={setIsAuthenticated} />
                </PrivateRoute>
              }
            />

            <Route
              path="/addtasks"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Addtasks setIsAuthenticated={setIsAuthenticated} />{" "}
                </PrivateRoute>
              }
            />
            <Route path="/education" element={<PrivateRoute isAuthenticated={isAuthenticated}><Education/></PrivateRoute>} />
            <Route path="/mythings" element={<PrivateRoute isAuthenticated={isAuthenticated}><Mythings/></PrivateRoute>} />
            <Route path="/myjob" element={<PrivateRoute isAuthenticated={isAuthenticated}><Myjob/></PrivateRoute>} />
            <Route path="/privatepassword"   element={<PrivateRoute isAuthenticated={isAuthenticated}><PrivatePassword/></PrivateRoute>}/>
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
