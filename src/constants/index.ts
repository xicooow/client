import { HeaderLink } from "../types";

export const PAGES = {
  LOGIN: "login",
  ACCOUNT: "account",
  REGISTER: "register",
  SHOPPING_LIST: "shoppingList",
  SHOPPING_LISTS: "shoppingLists",
};
export const HEADER_HEIGHT = 56;
export const HEADER_LINKS: HeaderLink[] = [
  {
    url: `/${PAGES.ACCOUNT}`,
    label: "Conta",
    sublinks: [],
  },
  {
    url: `/${PAGES.SHOPPING_LISTS}`,
    label: "Listas",
    sublinks: [],
  },
];
export const QUERY_KEYS = {
  ACCOUNT: ["fetch_account"],
  SHOPPING_LIST: ["fetch_shopping_list"],
  SHOPPING_LISTS: ["fetch_shopping_lists"],
};
export const AUTH_TOKEN_KEY = "auth_token";
export const API_URL = import.meta.env.VITE_API_URL;
export const currencyFormat = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
  minimumFractionDigits: 2,
}).format;
