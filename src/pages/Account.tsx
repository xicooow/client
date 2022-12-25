import dayjs from "dayjs";
import { useClipboard } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { FunctionComponent, ReactNode, useMemo } from "react";
import {
  Button,
  Group,
  Text,
  Box,
  createStyles,
  Tooltip,
} from "@mantine/core";
import {
  IconAt,
  IconCalendar,
  IconId,
  IconCopy,
} from "@tabler/icons";

import { useStore } from "../context/store";
import { AUTH_TOKEN_KEY, PAGES } from "../constants";
import CustomIconLoader from "../components/CustomIconLoader";

const useStyles = createStyles(theme => ({
  link: {
    display: "block",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],

    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const AccountComponent: FunctionComponent = () => {
  const { user, cleanup } = useStore();
  const navigate = useNavigate();
  const { copy } = useClipboard();
  const { classes } = useStyles();

  const isLoading = useMemo(() => !user._id, [user._id]);

  const disconnect = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    cleanup();
    navigate(`/${PAGES.LOGIN}`);
  };

  let content: ReactNode;

  if (isLoading) {
    content = (
      <Group position="center">
        <CustomIconLoader text="Carregando..." />
      </Group>
    );
  } else {
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
              className={`${classes.link} clickable`}
              onClick={e => {
                e.preventDefault();
                copy(user._id);
                showNotification({
                  autoClose: 3000,
                  icon: <IconCopy />,
                  message:
                    "Copiado para a área de transferência",
                });
              }}
            >
              {user._id}
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
          <Text size="xs">{user.email}</Text>
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
          <Text size="xs">
            {dayjs(user.cre_date).format("LLL")}
          </Text>
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
        {user.name}
      </Text>
      {content}
    </Box>
  );
};

export default AccountComponent;
