import PageNotFound from "pages/PageNotFound/PageNotFound";
import React, { lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import ProjectTable from "modules/Tables/ProjectTable";
import DetailBoard from "pages/ProjectDetail/DetailBoard";
import UserTable from "modules/Tables/UserTable";
import EditUser from "pages/EditUser/EditUser";
import ChatPage from "pages/Chat/ChatPage";
import CreateProject from "pages/CreateProject/CreateProject";
import ProjectManagement from "pages/Management/ProjectManagement";
import TaskManagement from "pages/Management/TaskManagement";
import Dashboard from "pages/Dashboard/Dashboard";

const Login = lazy(() => import("pages/SignIn/Login"));
const AuthGuards = lazy(() => import("guards/auth.guards"));
const NoAuthGuards = lazy(() => import("guards/no-auth.guards"));
const HomeLayout = lazy(() => import("../layouts/HomeLayout"));

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
      ],
    },
    {
      path: "/",
      element: <AuthGuards />,
      children: [
        {
          path: "/",
          element: <HomeLayout />,
          children: [
            {
              path: "/user-management",
              element: <UserTable />,
            },
            {
              path: "/user-management/edit-user/:userId",
              element: <EditUser />,
            },
            {
              path: "/user-management/create",
              element: <EditUser />,
            },
            // 1/////////////////////////////
            {
              path: "/project-management",
              element: <ProjectManagement />,
            },
            {
              path: "/project-management/project/:projectId",
              element: <DetailBoard />,
            },
            {
              path: "/project-management/create",
              element: <CreateProject />,
            },

            // 2 //////////////////////////////////

{
              path: "/task-management",
              element: <TaskManagement />,
            },


            {
              path: "/dashboard",
              element: <Dashboard />,
            },
            {
              path: "/chat",
              element: <ChatPage />,
            },
          ],
        },
        {},
      ],
    },

    //   ],
    // },

    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);
  return routing;
}
