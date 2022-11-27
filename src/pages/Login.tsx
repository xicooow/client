import {
  useState,
  FormEvent,
  ChangeEvent,
  FunctionComponent,
} from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import useFetch from "../hooks/useFetch";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    error,
    isLoading,
    mutate: login,
  } = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async params => {
      const { request } = useFetch<LoginResponse>("login", {
        method: "POST",
        body: JSON.stringify(params),
      });

      return await request();
    },
    onSuccess: data => {
      localStorage.setItem("auth", data.token);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Login</legend>
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
              disabled={!email || !password || isLoading}
            >
              Conectar
            </button>
          </div>
          {error && <div className="error">{error.message}</div>}
        </fieldset>
      </form>
      <Link to="/register">Criar usuário</Link>
    </>
  );
};

export default Login;
