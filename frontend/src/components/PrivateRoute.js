import React from "react";
import {  Navigate, useNavigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? ( <>{children} </>
  ) : ( 
  <Navigate to="/login" /> 
  );
};


export default PrivateRoute;
