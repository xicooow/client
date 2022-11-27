import { FunctionComponent } from "react";
import { useQuery } from "@tanstack/react-query";

import useFetch from "../hooks/useFetch";

interface AccountResponse {
  _id: string;
  name: string;
  email: string;
  cre_date: string;
}

const Account: FunctionComponent = () => {
  const { data, error, isLoading } = useQuery<
    AccountResponse,
    Error
  >(["fetch_account"], async () => {
    const request = useFetch<AccountResponse>("logged");

    return await request();
  });

  return <div>Account</div>;
};

export default Account;
