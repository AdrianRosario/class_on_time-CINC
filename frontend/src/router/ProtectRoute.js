import React from "react";
import { Route, Navigate } from "react-router-dom";

function ProtectRoute({ component: Component, isAuthenticated, ...rest }) {
    <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Navigate to="/login" />
      )
    }
  />
};

export default ProtectRoute;