import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout/MainLayout";
import Home from "../Pages/Home";
import Register from "../Pages/auth/Register";
import Login from "../Pages/auth/Login";
import Dashboard from "../Layout/Dashboard/Dashboard";
import ErrorPage from "../Pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement:<ErrorPage></ErrorPage>,
    children: [{ path: "/", element: <Home></Home>, index: true }],
  },
  {
    path: "register",
    element: <Register></Register>,
  },
  {
    path: "login",
    element: <Login></Login>,
  },
  {
    path:"dashboard",
    element:<Dashboard></Dashboard>,
    children:[],
  }
]);
