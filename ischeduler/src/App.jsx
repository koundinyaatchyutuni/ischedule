import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path:"/profile",
      element:<Profile/>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;