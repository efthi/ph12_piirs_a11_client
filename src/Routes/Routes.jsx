import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout/MainLayout";
import Home from "../Pages/Home";
import Register from "../Pages/auth/Register";
import Login from "../Pages/auth/Login";
import DashboardLayout from "../Layout/Dashboard/DashboardLayout";
import ErrorPage from "../Pages/ErrorPage";
import Welcome from "../Pages/dashboard/Welcome";
import PrivateRoutes from "./PrivateRoutes";
import GuestRoutes from "./GuestRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { path: "/", element: <Home></Home>, index: true },
      { path: "all-issues", element: "<p>All Issue Page</p>" },
      { path: "about", element: "<p>About Page</p>" },
      { path: "contact", element: "<p>Contact Page</p>" },
    ],
  },
  {
    path: "register",
    element: <GuestRoutes><Register></Register></GuestRoutes> ,
  },
  {
    path: "login",
    element: <GuestRoutes><Login></Login></GuestRoutes>,
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
  {
    path: "dashboard",
    element: <PrivateRoutes><DashboardLayout></DashboardLayout></PrivateRoutes>,
    children: [{ element: <Welcome></Welcome>, index: true },
      {path:"profile", element:'<p>Profile Page</p>'},
    ],
  },
]);
