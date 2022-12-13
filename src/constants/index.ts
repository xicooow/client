import { HeaderLink } from "../types";

export const PAGES = {
  LOGIN: "login",
  ACCOUNT: "account",
  REGISTER: "register",
  SHOPPING_LISTS: "shoppingLists",
};
export const HEADER_LINKS: HeaderLink[] = [
  {
    url: `/${PAGES.ACCOUNT}`,
    label: "Conta",
    sublinks: [],
  },
  {
    url: "",
    label: "Listas",
    sublinks: [
      {
        url: `/${PAGES.SHOPPING_LISTS}?status=active`,
        label: "Ativas",
      },
      {
        url: `/${PAGES.SHOPPING_LISTS}?status=inactive`,
        label: "Inativas",
      },
    ],
  },
];
export const QUERY_KEYS = {
  ACCOUNT: ["fetch_account"],
};
export const AUTH_TOKEN_KEY = "auth_token";
export const API_URL = import.meta.env.VITE_API_URL;
