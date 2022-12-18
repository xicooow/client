import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { Fragment, FunctionComponent, useEffect } from "react";
import {
  IconChevronDown,
  IconShoppingCart,
} from "@tabler/icons";
import {
  createStyles,
  Header,
  Menu,
  Group,
  Stack,
  Burger,
  Container,
  Button,
  Drawer,
  ScrollArea,
  Divider,
} from "@mantine/core";

import api from "../../api";
import { useStore } from "../../context/store";
import { Account, HeaderProps } from "../../types";
import { HEADER_HEIGHT, QUERY_KEYS } from "../../constants";

const useStyles = createStyles(theme => ({
  inner: {
    display: "flex",
    alignItems: "center",
    height: HEADER_HEIGHT,
    justifyContent: "space-between",
  },
  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  link: {
    display: "flex",
    padding: "8px 12px",
    border: "none",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    height: 37,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
  linksMenu: {
    [theme.fn.smallerThan("sm")]: {
      width: "calc(100vw / 1.125) !important",
    },
  },
}));

const HeaderMenu: FunctionComponent<HeaderProps> = ({
  links,
}) => {
  const { classes, theme } = useStyles();
  const { user, setUser } = useStore();
  const [opened, { toggle }] = useDisclosure(false);

  const { refetch } = useQuery<Account, Error>(
    QUERY_KEYS.ACCOUNT,
    async () => {
      const request = api<Account>("logged");

      return await request();
    },
    {
      enabled: false,
      onSuccess: setUser,
    }
  );

  useEffect(() => {
    if (!user._id) {
      refetch();
    }
  }, [user._id]);

  const handleLinkClick = () => {
    if (opened) {
      toggle();
    }
  };

  const items = links.map(link => {
    const menuItems = link.sublinks.map((item, index) => (
      <Fragment key={index}>
        <Link
          to={item.url}
          className={classes.link}
          onClick={handleLinkClick}
        >
          {item.label}
        </Link>
      </Fragment>
    ));

    if (menuItems.length > 0) {
      return (
        <Menu
          trigger="click"
          key={link.label}
          exitTransitionDuration={0}
        >
          <Menu.Target>
            <Button
              variant="subtle"
              className={classes.link}
              rightIcon={<IconChevronDown size={18} />}
            >
              {link.label}
            </Button>
          </Menu.Target>
          <Menu.Dropdown className={classes.linksMenu}>
            {menuItems}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Fragment key={link.url}>
        <Link
          to={link.url}
          className={classes.link}
          onClick={handleLinkClick}
        >
          {link.label}
        </Link>
      </Fragment>
    );
  });

  return (
    <Header
      mb={60}
      height={HEADER_HEIGHT}
    >
      <Container>
        <div className={classes.inner}>
          <Button
            px={0}
            size="md"
            color="dark"
            variant="subtle"
            leftIcon={<IconShoppingCart />}
          >
            Mercadin
          </Button>
          <Group
            spacing="sm"
            className={classes.links}
          >
            {items}
          </Group>
          <Burger
            size="sm"
            opened={opened}
            onClick={toggle}
            className={classes.burger}
          />
        </div>
        <Drawer
          size="100%"
          padding="md"
          title="Menu"
          opened={opened}
          zIndex={1000000}
          onClose={toggle}
        >
          <ScrollArea
            mx="-md"
            sx={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
          >
            <Divider
              my="sm"
              color={
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0]
              }
            />
            <Stack
              px="md"
              spacing="sm"
              align="stretch"
            >
              {items}
            </Stack>
          </ScrollArea>
        </Drawer>
      </Container>
    </Header>
  );
};

export default HeaderMenu;
