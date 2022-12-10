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
  Center,
  Burger,
  Container,
  Button,
} from "@mantine/core";

import api from "../../api";
import { QUERY_KEYS } from "../../constants";
import { useStore } from "../../context/store";
import { Account, HeaderProps } from "../../types";

const HEADER_HEIGHT = 56;

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
    display: "block",
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
  linkLabel: {
    marginRight: 5,
  },
}));

const HeaderMenu: FunctionComponent<HeaderProps> = ({
  links,
}) => {
  const { classes } = useStyles();
  const { user, setUser } = useStore();
  const [opened, { toggle }] = useDisclosure(false);

  const logged = useQuery<Account, Error>(
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
      logged.refetch();
    }
  }, [user._id]);

  const items = links.map(link => {
    const menuItems = link.sublinks.map((item, index) => (
      <Fragment key={index}>
        <Link to={item.url} />
      </Fragment>
    ));

    if (menuItems.length > 0) {
      return (
        <Menu
          trigger="hover"
          key={link.label}
          exitTransitionDuration={0}
        >
          <Menu.Target>
            <Link
              to={link.url}
              className={classes.link}
            >
              <Center>
                <span className={classes.linkLabel}>
                  {link.label}
                </span>
                <IconChevronDown
                  size={12}
                  stroke={1.5}
                />
              </Center>
            </Link>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link
        to={link.url}
        key={link.url}
        className={classes.link}
      >
        {link.label}
      </Link>
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
            size="md"
            color="dark"
            variant="subtle"
            leftIcon={<IconShoppingCart />}
          >
            Mercadin
          </Button>
          <Group
            spacing={5}
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
      </Container>
    </Header>
  );
};

export default HeaderMenu;
