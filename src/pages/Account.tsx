import { FunctionComponent, ReactNode } from "react";
import { IconLoader, IconAt, IconCalendar } from "@tabler/icons";
import {
  Button,
  Group,
  Text,
  Divider,
  Box,
} from "@mantine/core";
import {
  QueryKey,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";

import api from "../api";
import { Account } from "../types";
import { AUTH_TOKEN_KEY } from "../constants";

export const ACCOUNT_QUERY_KEY: QueryKey = ["fetch_account"];

const AccountComponent: FunctionComponent = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Account, Error>(
    ACCOUNT_QUERY_KEY,
    async () => {
      const request = api<Account>("logged");

      return await request();
    }
  );

  const disconnect = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    queryClient.invalidateQueries(ACCOUNT_QUERY_KEY);
  };

  let content: ReactNode;

  if (error) {
    content = (
      <Group position="center">
        <Text color="red">{error.message}</Text>
      </Group>
    );
  }

  if (isLoading) {
    content = (
      <Group position="center">
        <Text>
          Carregando...{" "}
          <IconLoader
            style={{ animation: "spin 2s linear infinite" }}
          />
        </Text>
      </Group>
    );
  }

  if (data) {
    const { name, email, cre_date } = data;

    content = (
      <>
        <Group>
          <Text
            size="lg"
            weight={500}
          >
            {name}
          </Text>
        </Group>
        <Group
          noWrap
          mt={5}
          spacing={10}
        >
          <IconAt
            size={16}
            stroke={1.5}
          />
          <Text size="xs">{email}</Text>
        </Group>
        <Group
          noWrap
          mt={5}
          spacing={10}
        >
          <IconCalendar
            size={16}
            stroke={1.5}
          />
          <Text size="xs">{dayjs(cre_date).format("LLL")}</Text>
        </Group>
        <Group
          mt="md"
          position="right"
        >
          <Button
            color="red"
            type="button"
            variant="light"
            onClick={disconnect}
          >
            Desconectar
          </Button>
        </Group>
      </>
    );
  }

  return (
    <Box
      mx="auto"
      sx={{ maxWidth: 475 }}
    >
      <Text
        size="md"
        weight={600}
        sx={{ textTransform: "uppercase" }}
      >
        Minha conta
      </Text>
      <Divider my="md" />
      {content}
    </Box>
  );
};

export default AccountComponent;
