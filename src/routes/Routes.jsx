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
import AdminRoute from "./AdminRoute";
import VolunteerRoute from "./VolunteerRoute";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome"; 

import Profile from "../pages/Dashboard/Profile";
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";
import MyDonationRequests from "../pages/Dashboard/MyDonationRequests";

import RequestDetails from "../pages/DonationRequests/RequestDetails";

import AllUsers from "../pages/Dashboard/AllUsers";
import AllBloodRequests from "../pages/Dashboard/AllBloodRequests";

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
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },
      {
        path: "donation-request/:id",
        element: (
          <PrivateRoute>
            <RequestDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />, // এখানে রিপ্লেস করা হয়েছে
      },

      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },

      {
        path: "my-donation-requests",
        element: <MyDonationRequests />,
      },

      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },

      {
        path: "all-blood-donation-request",
        element: (
          <VolunteerRoute>
            <AllBloodRequests />
          </VolunteerRoute>
        ),
      },
    ],
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);