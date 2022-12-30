import { useState, useEffect, FunctionComponent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import {
  Paper,
  Button,
  Group,
  Text,
  TextInput,
} from "@mantine/core";

import api from "../api";
import { AUTH_TOKEN_KEY, PAGES } from "../constants";
import { LoginPayload, LoginResponse } from "../types";
import CustomIconLoader from "../components/CustomIconLoader";

const Login: FunctionComponent = () => {
  const navigate = useNavigate();

  const form = useForm<LoginPayload>({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const [authToken, setAuthToken] = useState<string | null>(
    null
  );

  const {
    error,
    isLoading,
    mutate: login,
  } = useMutation<LoginResponse, Error, LoginPayload>({
    onSuccess: ({ token }: LoginResponse) => setAuthToken(token),
    mutationFn: async (params: LoginPayload) => {
      const request = api<LoginResponse>("login", {
        method: "POST",
        body: JSON.stringify(params),
      });

      return await request();
    },
  });

  useEffect(() => {
    const goToAccountPage = () => navigate(`/${PAGES.ACCOUNT}`);

    if (authToken) {
      // has been logged
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
      goToAccountPage();
    } else if (localStorage.getItem(AUTH_TOKEN_KEY)) {
      // already logged
      goToAccountPage();
    }
  }, [authToken]);

  return (
    <Paper
      p="xl"
      mt="xl"
      mx="auto"
      withBorder
      radius="md"
      sx={{ maxWidth: 475 }}
    >
      <Text
        mb="lg"
        size="lg"
        weight={500}
      >
        Mercadin, seu assistente de compras
      </Text>
      <form onSubmit={form.onSubmit(values => login(values))}>
        <TextInput
          required
          type="email"
          label="Email"
          {...form.getInputProps("email")}
        />
        <TextInput
          required
          label="Senha"
          type="password"
          {...form.getInputProps("password")}
        />
        <Group
          mt="md"
          position="apart"
        >
          <Text>
            <Link to={`/${PAGES.REGISTER}`}>Criar usuário</Link>
          </Text>
          <Button
            type="submit"
            disabled={isLoading || !form.isDirty()}
          >
            {isLoading ? <CustomIconLoader /> : "Conectar"}
          </Button>
        </Group>
      </form>
      {error && (
        <Group
          mt="md"
          position="center"
        >
          <Text color="red">{error.message}</Text>
        </Group>
      )}
    </Paper>
  );
};

export default Login;
