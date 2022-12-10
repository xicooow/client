import dayjs from "dayjs";
import { useClipboard } from "@mantine/hooks";
import { FunctionComponent, ReactNode } from "react";
import { showNotification } from "@mantine/notifications";
import {
  Button,
  Group,
  Text,
  Box,
  createStyles,
  Tooltip,
} from "@mantine/core";
import {
  IconLoader,
  IconAt,
  IconCalendar,
  IconId,
  IconCopy,
} from "@tabler/icons";
import {
  QueryKey,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../api";
import { Account } from "../types";
import { AUTH_TOKEN_KEY } from "../constants";

export const ACCOUNT_QUERY_KEY: QueryKey = ["fetch_account"];

const useStyles = createStyles(theme => ({
  link: {
    display: "block",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    cursor: "pointer",

    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const AccountComponent: FunctionComponent = () => {
  const { copy } = useClipboard();
  const { classes } = useStyles();
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
    const { email, cre_date, _id } = data;

    content = (
      <>
        <Group
          noWrap
          mt={5}
          spacing={10}
        >
          <IconId />
          <Tooltip
            withArrow
            label="Identificador do usuário"
          >
            <Text
              size="lg"
              className={classes.link}
              onClick={e => {
                e.preventDefault();
                copy(_id);
                showNotification({
                  autoClose: 3000,
                  icon: <IconCopy />,
                  message:
                    "Copiado para a área de transferência",
                });
              }}
            >
              {_id}
            </Text>
          </Tooltip>
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
        size="lg"
        weight={600}
        sx={{ textTransform: "capitalize" }}
      >
        {data?.name || ""}
      </Text>
      {content}
    </Box>
  );
};

export default AccountComponent;
