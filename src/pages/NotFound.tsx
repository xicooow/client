import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Group,
  Button,
  Container,
  createStyles,
} from "@mantine/core";

import { PAGES } from "../constants";

const useStyles = createStyles(theme => ({
  root: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],
    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },
}));

const NotFound: FunctionComponent = () => {
  const navigate = useNavigate();
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Group position="center">
        <Title>Esta página não existe</Title>
        <Text
          size="lg"
          align="center"
        >
          Infelizmente, esta é apenas uma página 404.
          <br />
          Você pode ter digitado o endereço errado ou a página
          foi movida para outro lugar.
        </Text>
      </Group>
      <Group
        mt="md"
        position="center"
      >
        <Button
          size="md"
          color="red"
          variant="light"
          onClick={() => navigate(`/${PAGES.ACCOUNT}`)}
        >
          Ir para página inicial
        </Button>
      </Group>
    </Container>
  );
};

export default NotFound;
