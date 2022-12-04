import { FunctionComponent, ReactNode } from "react";
import {
  QueryKey,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import moment from "moment";

import api from "../api";
import { Account } from "../types";
import { AUTH_TOKEN_KEY } from "../constants";

export const ACCOUNT_QUERY_KEY: QueryKey = ["fetch_account"];

const AccountComponent: FunctionComponent = () => {
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
    content = <div className="error">{error.message}</div>;
  }

  if (isLoading) {
    content = <p>Carregando...</p>;
  }

  if (data) {
    const { name, email, cre_date } = data;

    content = (
      <form>
        <div className="input-group">
          <label htmlFor="name">Nome</label>
          <input
            readOnly
            disabled
            id="name"
            type="text"
            value={name}
            name="name-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            readOnly
            disabled
            id="email"
            type="email"
            value={email}
            name="email-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="date">Data de Criação</label>
          <input
            readOnly
            disabled
            id="date"
            type="text"
            value={moment(cre_date).format("LLL")}
            name="date-input"
          />
        </div>
        <div className="button-group">
          <button
            type="button"
            onClick={disconnect}
          >
            Desconectar
          </button>
        </div>
      </form>
    );
  }

  return (
    <section className="account">
      <h2>Minha conta</h2>
      {content}
    </section>
  );
};

export default AccountComponent;
