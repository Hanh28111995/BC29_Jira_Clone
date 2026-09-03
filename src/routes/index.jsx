import Register from "pages/register/Register";
import PageNotFound from "pages/PageNotFound/PageNotFound";

import React, { lazy } from "react";

import { useRoutes, Navigate } from "react-router-dom";
import ProjectTable from "modules/project-table/ProjectTable";
import CreateProjectTable from "pages/CreateProject/CreateProject";
import MBoard from "pages/ProjectDetail/MBoard";
import DetailBoard from "pages/ProjectDetail/DetailBoard";
import UserTable from "modules/user-table/UserTable";
import EditUser from "pages/EditUser/EditUser";

const Login = lazy(() => import("pages/login/Login"));
const AuthGuards = lazy(() => import("guards/auth.guards"));
const NoAuthGuards = lazy(() => import("guards/no-auth.guards"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));

export default function Router() {
  const routing = useRoutes([
    {
      path: "/",
      element: <NoAuthGuards />,
      children: [
        {
          path: "/",
          element: <Navigate to="/login" />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <AuthGuards />,
      children: [
        {
          path: "/project-management",
          element: <AdminLayout />,
          children: [
            {
              path: "/project-management/user",
              element: <UserTable />,
            },
            {
              path: "/project-management/UserEdit/:userId",
              element: <EditUser />,
            },
            {
              path: "/project-management/UserCreate",
              element: <EditUser />,
            },
            {
              path: "/project-management/project",
              element: <ProjectTable />,
            },
            {
              path: "/project-management/create-project",
              element: <CreateProjectTable />,
            },
            {
              path: "/project-management/board",
              element: <MBoard />,
            },
            {
              path: "/project-management/project-detail/:projectId",
              element: <DetailBoard />,
            },
          ]
        },

      ],
    },


    //   ],
    // },

    {
      path: '*',
      element: <PageNotFound />
    },
  ]);
  return routing;
}
