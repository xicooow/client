import { PAGES } from "../pages";
import { HeaderLink } from "../types";

export const HEADER_LINKS: HeaderLink[] = [
  {
    url: `/${PAGES.ACCOUNT}`,
    label: "Conta",
    sublinks: [],
  },
];
export const AUTH_TOKEN_KEY = "auth_token";
export const API_URL = import.meta.env.VITE_API_URL;
