import { FunctionComponent } from "react";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { PAGES } from "./constants";

import Root from "./pages/Root";
import Login from "./pages/Login";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ShoppingLists from "./pages/ShoppingLists";

const App: FunctionComponent = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Login /> },
        { path: PAGES.LOGIN, element: <Login /> },
        { path: PAGES.ACCOUNT, element: <Account /> },
        { path: PAGES.REGISTER, element: <Register /> },
        {
          path: PAGES.SHOPPING_LISTS,
          element: <ShoppingLists />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
