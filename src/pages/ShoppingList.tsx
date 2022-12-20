import dayjs from "dayjs";
import { Grid, Stack } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useMemo } from "react";

import api from "../api";
import { QUERY_KEYS } from "../constants";
import SplashScreen from "../components/SplashScreen";
import { ShoppingItem, ShoppingList } from "../types";

const ShoppingListDetail: FunctionComponent = () => {
  const { shoppingListId } = useParams();

  const { data, isLoading } = useQuery<ShoppingList, Error>(
    QUERY_KEYS.SHOPPING_LIST,
    async () => {
      const request = api<ShoppingList>(
        `shoppingList/${shoppingListId}`
      );

      return await request();
    }
  );

  const shoppingList = useMemo<typeof data>(() => {
    if (data) {
      return {
        ...data,
        items: data.items.map(item => ({
          ...item,
          fields: new Map(Object.entries(item.fields)),
        })),
        columns: new Map(Object.entries(data.columns)),
      };
    }
  }, [data]);

  if (isLoading || !shoppingList) {
    return <SplashScreen />;
  }

  const buildColumns = (): [string, string][] => {
    const allColumns: [string, string][] = [
      ["done", ""],
      ["cre_date", "Data de Criação"],
    ];

    for (const column of shoppingList.columns.entries()) {
      allColumns.push(column);
    }

    return allColumns;
  };

  const columns = new Map<string, string>(buildColumns());

  const buildItem = (item: ShoppingItem) => {
    const mapped = new Map<string, string>();
    mapped.set("done", String(item.done));
    mapped.set("cre_date", dayjs(item.cre_date).format("LT"));

    for (const [key, value] of item.fields.entries()) {
      mapped.set(key, value);
    }

    return mapped;
  };

  const items = shoppingList.items.map(buildItem);

  const renderColumns = () => {
    const uiColumns: JSX.Element[] = [];

    for (const value of columns.values()) {
      uiColumns.push(<Grid.Col span="auto">{value}</Grid.Col>);
    }

    return <Grid>{uiColumns}</Grid>;
  };

  const renderItems = () => {
    const uiItems: JSX.Element[] = [];

    for (const item of items) {
      const itemRow: JSX.Element[] = [];

      for (const key of columns.keys()) {
        itemRow.push(
          <Grid.Col span="auto">{item.get(key)}</Grid.Col>
        );
      }

      uiItems.push(<Grid>{itemRow}</Grid>);
    }

    return uiItems;
  };

  return (
    <Stack>
      {renderColumns()}
      {renderItems()}
    </Stack>
  );
};

export default ShoppingListDetail;
