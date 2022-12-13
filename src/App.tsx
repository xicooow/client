import { FunctionComponent, lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { PAGES } from "./constants";

import Root from "./pages/Root";

const Login = lazy(() => import("./pages/Login"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Register = lazy(() => import("./pages/Register"));
const ShoppingList = lazy(() => import("./pages/ShoppingList"));
const ShoppingLists = lazy(
  () => import("./pages/ShoppingLists")
);

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
        {
          path: `${PAGES.SHOPPING_LIST}/:shoppingListId`,
          element: <ShoppingList />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
