import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import { Navigate } from "react-router-dom";
import { authRoutes } from "../features/Authentication/routes";

export const routes = createBrowserRouter([{
  path: "/",
  element: <RootLayout/>,
  children: [
    ...authRoutes,
    {
      index: true,
      element: <Navigate to="/auth" replace/>,
    },
  ]
}])
