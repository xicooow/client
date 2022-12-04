import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  FunctionComponent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import api from "../api";
import { AUTH_TOKEN_KEY } from "../constants";
import { LoginPayload, LoginResponse } from "../types";

const Login: FunctionComponent = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(
    null
  );

  const mutationFn = async (params: LoginPayload) => {
    const request = api<LoginResponse>("login", {
      method: "POST",
      body: JSON.stringify(params),
    });

    return await request();
  };

  const {
    error,
    isLoading,
    mutate: login,
  } = useMutation<LoginResponse, Error, LoginPayload>({
    onSuccess: ({ token }: LoginResponse) => setAuthToken(token),
    mutationFn,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  useEffect(() => {
    const goToAccountPage = () => navigate("/account");

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
    <section className="login">
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
      <p>
        <Link to="/register">Criar usuário</Link>
      </p>
    </section>
  );
};

export default Login;
