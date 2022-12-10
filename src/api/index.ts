import { AUTH_TOKEN_KEY, API_URL, PAGES } from "../constants";

const getResponseError = async (text: Promise<string>) => {
  try {
    const rawMessage = await Promise.resolve(text);
    const data = JSON.parse(rawMessage);
    return data.message as string;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
};

export default <R = any>(
  endpoint: string,
  options?: RequestInit
) => {
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);

  const { method = "GET", body = JSON.stringify({}) } =
    options || {};

  const headers: HeadersInit = new Headers();

  headers.set("Accept", "application/json");
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

    if (response.status === 401) {
      window.location.href = `/${PAGES.LOGIN}`;
    }

    if (!response.ok) {
      throw new Error(await getResponseError(response.text()));
    }

    return (await response.json()) as R;
  };
};
