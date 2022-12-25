import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import {
  QueryClient,
  QueryOptions,
  QueryClientProvider,
} from "@tanstack/react-query";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.locale("pt-br");
dayjs.extend(localizedFormat);

import App from "./App";
import { Store } from "./context/store";

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
      <MantineProvider
        theme={{
          colorScheme: "dark",
          fontFamily: "Ubuntu, sans-serif",
          globalStyles: () => ({
            ".text-ellipsis": {
              maxWidth: "fit-content",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            },
            ".clickable": {
              cursor: "pointer",
            },
            ".v-scroll": {
              overflowY: "auto",
              overflowX: "hidden",
            },
          }),
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider>
            <Store>
              <App />
            </Store>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
