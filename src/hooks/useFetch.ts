const API_URL = "http://localhost:5000/api";

const useFetch = <R = any>(
  endpoint: string,
  options?: RequestInit
) => {
  const {
    method = "GET",
    body = JSON.stringify({}),
    headers = {
      "Content-Type": "application/json",
    },
  } = options || {};

  const input = `${API_URL}/${endpoint}`;

  const request = async () => {
    const response = await fetch(input, {
      method,
      headers,
      ...(method !== "GET" && method !== "DELETE" && { body }),
    });

    if (!response.ok) throw new Error("Tente novamente...");

    return (await response.json()) as R;
  };

  return { request };
};

export default useFetch;
