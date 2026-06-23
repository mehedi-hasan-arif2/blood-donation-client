import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Search from "../pages/Search";
import DonationRequests from "../pages/DonationRequests";
import Funding from "../pages/Funding";

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
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
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
        element: <Funding />,
      },
    ],
  },
]);