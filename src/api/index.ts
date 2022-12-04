import { AUTH_TOKEN_KEY, API_URL } from "../constants";

export default <R = any>(
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

  return async () => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers,
      ...(method !== "GET" && method !== "DELETE" && { body }),
    });

    if (response.status === 401) window.location.href = "/login";

    if (!response.ok) throw new Error(await response.text());

    return (await response.json()) as R;
  };
};
