import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Search from "../pages/Search";
import DonationRequests from "../pages/DonationRequests/DonationRequests"; 
import Funding from "../pages/Funding";
import ErrorPage from "../pages/ErrorPage";
import PrivateRoute from "./PrivateRoute"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "donation-requests",
        element: <DonationRequests />,
      },
      {
        path: "funding",
        element: <PrivateRoute><Funding /></PrivateRoute>, 
      },
    ],
  },
  // AUTH ROUTES
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // 404 ERROR ROUTE 
  {
    path: "*",
    element: <ErrorPage />,
  },
]);