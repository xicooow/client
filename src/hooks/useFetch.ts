import { AUTH_TOKEN_KEY } from "../constants";

const API_URL = import.meta.env.VITE_API_URL;

const useFetch = <R = any>(
  endpoint: string,
  options?: RequestInit
) => {
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);

  const { method = "GET", body = JSON.stringify({}) } =
    options || {};

  const headers: HeadersInit = new Headers();
  headers.set("Content-Type", "application/json");
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const input = `${API_URL}/${endpoint}`;

  const request = async () => {
    const response = await fetch(input, {
      method,
      headers,
      ...(method !== "GET" && method !== "DELETE" && { body }),
    });

    if (response.status === 401) window.location.href = "/login";

    if (!response.ok) throw new Error("Tente novamente...");

    return (await response.json()) as R;
  };

  return request;
};

export default useFetch;
