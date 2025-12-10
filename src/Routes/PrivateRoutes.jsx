import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import Loader from "../Components/shared/Loader";

const PrivateRoutes = ({ children }) => {
  const { user, authload } = useAuth();
  let location = useLocation();

  // ১) আগে loading check
  if (authload) {
    return <Loader />;
  }

  // ২) তারপর user check
  if (user) {
    return children;
  }

  // ৩) logged in না হলে login এ পাঠাও
  return (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
};

export default PrivateRoutes;
