import { FunctionComponent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import {
  Paper,
  Text,
  TextInput,
  Group,
  Button,
} from "@mantine/core";

import api from "../api";
import { PAGES } from "../constants";
import { Account, RegistryPayload } from "../types";
import CustomIconLoader from "../components/CustomIconLoader";

const Register: FunctionComponent = () => {
  const navigate = useNavigate();

  const form = useForm<RegistryPayload>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    error,
    isLoading,
    mutate: register,
  } = useMutation<Account, Error, RegistryPayload>({
    onSuccess: () => navigate(`/${PAGES.LOGIN}`),
    mutationFn: async (params: RegistryPayload) => {
      const request = api<Account>("user", {
        method: "POST",
        body: JSON.stringify(params),
      });

      return await request();
    },
  });

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
        Registre-se
      </Text>
      <form onSubmit={form.onSubmit(values => register(values))}>
        <TextInput
          required
          type="text"
          label="Nome"
          {...form.getInputProps("name")}
        />
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
          position="right"
        >
          <Button
            type="submit"
            disabled={isLoading || !form.isDirty()}
          >
            {isLoading ? <CustomIconLoader /> : "Criar"}
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

export default Register;
