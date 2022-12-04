import {
  FunctionComponent,
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import api from "../api";
import { Account, RegistryPayload } from "../types";

const Register: FunctionComponent = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register({ name, email, password });
  };

  const mutationFn = async (params: RegistryPayload) => {
    const request = api<Account>("user", {
      method: "POST",
      body: JSON.stringify(params),
    });

    return await request();
  };

  const {
    error,
    isLoading,
    mutate: register,
  } = useMutation<Account, Error, RegistryPayload>({
    onSuccess: () => navigate("/login"),
    mutationFn,
  });

  return (
    <section className="register">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Novo</legend>
          <div className="input-group">
            <label htmlFor="name">Nome</label>
            <input
              required
              id="name"
              type="text"
              value={name}
              name="name-input"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              required
              id="email"
              type="email"
              value={email}
              name="email-input"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              required
              id="password"
              type="password"
              value={password}
              name="password-input"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div className="button-group">
            <button
              type="submit"
              disabled={
                !name || !email || !password || isLoading
              }
            >
              Criar
            </button>
          </div>
          {error && <div className="error">{error.message}</div>}
        </fieldset>
      </form>
    </section>
  );
};

export default Register;
