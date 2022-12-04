import { FunctionComponent } from "react";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import Root from "./pages/Root";
import Login from "./pages/Login";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

const App: FunctionComponent = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "account", element: <Account /> },
        { path: "register", element: <Register /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
