import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout/MainLayout";
import Home from "../pages/Home";
import Register from "../Pages/auth/Register";
import Login from "../Pages/auth/Login";
import DashboardLayout from "../Layout/Dashboard/DashboardLayout";
import ErrorPage from "../Pages/ErrorPage";
import Welcome from "../Pages/dashboard/Welcome";
import PrivateRoutes from "./PrivateRoutes";
import GuestRoutes from "./GuestRoutes";
import ReportIssue from "../Pages/dashboard/ReportIssue";
import AllIssues from "../Pages/AllIssues";
import PaymentOk from "../Pages/Payment/PaymentOk";
import PaymentFail from "../Pages/Payment/PaymentFail";
import Profile from "../Pages/dashboard/Profile";
import IssueDetails from "../Pages/IssueDetails";
import MyIssues from "../Pages/dashboard/MyIssues";
import CreateStaff from "../Pages/dashboard/Admin/CreateStaff";
import ListIssues from "../Pages/dashboard/Admin/ListIssues";
import StaffList from "../Pages/dashboard/Admin/StaffList";
import UserList from "../Pages/dashboard/Admin/UserList";
import AssignedIssue from "../Pages/dashboard/Staff/AssignedIssue";
import BoostOk from "../Pages/Payment/BoostOk";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { path: "/", element: <Home></Home>, index: true },
      { path: "all-issues", element: <AllIssues></AllIssues> },
      { path: "about", element: <p className="text-center text-2xl font-bold mb-6">About Page</p> },
      { path: "contact", element: <p className="text-center text-2xl font-bold mb-6">Contact Page</p> },
    ],
  },
  {
    path: "register",
    element: (
      <GuestRoutes>
        <Register></Register>
      </GuestRoutes>
    ),
  },
  {
    path: "login",
    element: (
      <GuestRoutes>
        <Login></Login>
      </GuestRoutes>
    ),
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),
    children: [
      { element: <PrivateRoutes><Welcome></Welcome></PrivateRoutes>, index: true },
      { path: "my-issues", element: <MyIssues></MyIssues> },
      { path: "profile", element: <PrivateRoutes> <Profile></Profile> </PrivateRoutes> },
      { path: "report-issue", element: <ReportIssue></ReportIssue> },
      
      //admin
      {path: "add-staff", element: <CreateStaff></CreateStaff> },
      {path: "manage-staff", element:<StaffList></StaffList>},
      {path: "manage-users", element: <UserList></UserList>  },
      
      //Staff
      {path: "assigned-issues", element: <AssignedIssue></AssignedIssue>  },

      {path: "all-issues", element:<ListIssues></ListIssues> },
      //{path:"edit-issue/:id", element: <h1 className="text-center text-2xl font-bold mb-6">Edit Issue from routes</h1> ,},
      {path: "payment-success/", element: <PaymentOk></PaymentOk>},
      {path: "payment-cancel", element: <PaymentFail></PaymentFail> },
      {path: "view-issue/:id", element: <IssueDetails></IssueDetails>},
      {path: "boost-success", element: <BoostOk></BoostOk>},
      
    ],
  },

]);
