import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import Loader from "../Components/shared/Loader";

const GuestRoutes = ({ children }) => {
  const { user, authload } = useAuth();
//  let location = useLocation();
  if (authload) {
    return <Loader></Loader>;
  }
  if (user) {
    const backTo = "/dashboard";
    return <Navigate to={backTo} replace></Navigate>;
  }

  return children;
};

export default GuestRoutes;
