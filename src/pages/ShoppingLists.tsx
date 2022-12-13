import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
} from "react";

import api from "../api";
import { ShoppingList } from "../types";
import { QUERY_KEYS } from "../constants";
import StickyTable from "../components/StickyTable";

type ReducedShoppingLists = Pick<
  ShoppingList,
  "_id" | "title" | "cre_date"
>[];

const ShoppingLists: FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const [shoppingLists, setShoppingLists] =
    useState<ReducedShoppingLists>([]);

  const { isFetching, refetch } = useQuery<
    ReducedShoppingLists,
    Error
  >(
    QUERY_KEYS.SHOPPING_LISTS,
    async () => {
      const request = api<ReducedShoppingLists>(
        `shoppingLists?status=${statusParam}`
      );

      return await request();
    },
    {
      onSuccess: setShoppingLists,
    }
  );

  useEffect(() => {
    if (!isFetching && statusParam) {
      refetch();
    }
  }, [statusParam]);

  const items = useMemo(
    () =>
      shoppingLists.map(list => {
        const formatted: typeof list = {
          ...list,
          cre_date: dayjs(list.cre_date).format("lll"),
        };

        return new Map(Object.entries(formatted));
      }),
    [shoppingLists]
  );

  const columns = new Map([
    ["_id", "#"],
    ["title", "Lista"],
    ["cre_date", "Data de Criação"],
  ]);

  return (
    <StickyTable
      items={items}
      columns={columns}
      loading={isFetching}
    />
  );
};

export default ShoppingLists;
