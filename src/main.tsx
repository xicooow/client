import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryOptions,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";

const common: Partial<QueryOptions> = {
  retry: false,
  // 3 min
  cacheTime: 180000,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...common,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      ...common,
    },
  },
});

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
