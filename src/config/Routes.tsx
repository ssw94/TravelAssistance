import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import { Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../features/Authentication/Login";
import Register from "../features/Authentication/Register";

export const routes = createBrowserRouter([{
  path: "/",
  element: <RootLayout/>,
  children: [{
    path: "auth",
    element: <AuthLayout />,
    children: [{
      path:'login',
      element: <Login />,
    }, {
      path:'register',
      element: <Register />,
    }, {
      path: '',
      element: <Navigate to="/auth/login" replace/>,
    }]
  }, {
    index:true,
    element: <Navigate to="/auth" replace/>,
  }]
}])
