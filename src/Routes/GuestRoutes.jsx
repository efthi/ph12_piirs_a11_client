import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import Loader from "../components/shared/Loader";

const GuestRoutes = ({ children }) => {
  const { user, authload } = useAuth();
  let backto = useLocation();
  if (authload) {
    return <Loader></Loader>;
  }
  if (user) {
    const backto = location.state?.from?.pathname || "/";
    return <Navigate to={backto} replace></Navigate>;
  }

  return children;
};

export default GuestRoutes;
