import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { IconPencil, IconTrash } from "@tabler/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FunctionComponent,
  MouseEvent,
  PropsWithChildren,
  useMemo,
} from "react";
import {
  Button,
  Center,
  Grid,
  Stack,
  Group,
  Divider,
  createStyles,
  Title,
} from "@mantine/core";

import api from "../api";
import { QUERY_KEYS } from "../constants";
import SplashScreen from "../components/SplashScreen";
import {
  ShoppingList,
  ShoppingItem,
  ShoppingItemPayload,
  StringMap,
} from "../types";

const useStyles = createStyles(theme => ({
  item: {
    cursor: "pointer",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    "&.strike": {
      fontStyle: "italic",
      color: theme.colors.dark[3],

      "&:before": {
        content: "' '",
        position: "absolute",
        borderBottom: `2px solid ${theme.colors.dark[4]}`,
        width: " 100%",
        top: "50%",
        left: "0",
      },
    },
  },
}));

const ShoppingListDetail: FunctionComponent = () => {
  const { classes } = useStyles();
  const { shoppingListId } = useParams();

  const { data, isFetching, refetch } = useQuery<
    ShoppingList,
    Error
  >(QUERY_KEYS.SHOPPING_LIST, async () => {
    const request = api<ShoppingList>(
      `shoppingList/${shoppingListId}`
    );

    return await request();
  });

  const toggleItem = async ({
    shoppingListId,
    shoppingItemId,
  }: ShoppingItemPayload) => {
    const request = api<ShoppingItem>(
      `shoppingList/${shoppingListId}/item/${shoppingItemId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ action: "toggle" }),
      }
    );

    return await request();
  };

  const { isLoading, mutate: toggleShoppingItemStatus } =
    useMutation<ShoppingItem, Error, ShoppingItemPayload>({
      onSuccess: () => {
        refetch();
      },
      mutationFn: toggleItem,
    });

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

  if (isFetching || isLoading || !shoppingList) {
    return <SplashScreen />;
  }

  const buildColumns = () => {
    const allColumns: [string, string][] = [];

    for (const column of shoppingList.columns.entries()) {
      // config columns
      allColumns.push(column);
    }

    // default columns
    allColumns.push(["cre_date", "Data de Criação"]);
    allColumns.push(["actions", "Ações"]);

    return new Map(allColumns);
  };

  const buildItem = (item: ShoppingItem) => {
    const mapped: StringMap = new Map();
    mapped.set("_id", item._id);
    mapped.set("done", String(item.done));
    mapped.set("cre_date", dayjs(item.cre_date).format("L LT"));

    for (const [key, value] of item.fields.entries()) {
      mapped.set(key, value);
    }

    return mapped;
  };

  const columns = buildColumns();
  const items = shoppingList.items.map(buildItem);

  const renderColumns = () => {
    const uiColumns: JSX.Element[] = [];

    for (const value of columns.values()) {
      uiColumns.push(
        <Grid.Col
          fw={600}
          span="auto"
          key={value}
        >
          {value}
        </Grid.Col>
      );
    }

    return uiColumns;
  };

  const renderItems = () => {
    const uiItems: JSX.Element[] = [];

    if (items.length === 0) {
      return [
        <Grid key="empty">
          <Grid.Col span="auto">
            <Center fs="italic">Sem resultados</Center>
          </Grid.Col>
        </Grid>,
      ];
    }

    for (const item of items) {
      const itemRow: JSX.Element[] = [];
      const isChecked = item.get("done") === "true";

      for (const key of columns.keys()) {
        switch (key) {
          case "actions":
            itemRow.push(
              <Grid.Col
                span="auto"
                key={item.get("_id")}
              >
                <Group
                  noWrap
                  position="left"
                >
                  <Button
                    px={8}
                    size="xs"
                    title="Editar"
                    hidden={isChecked}
                    onClick={(
                      e: MouseEvent<HTMLButtonElement>
                    ) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconPencil size={18} />
                  </Button>
                  <Button
                    px={8}
                    size="xs"
                    color="red"
                    title="Deletar"
                    hidden={isChecked}
                    onClick={(
                      e: MouseEvent<HTMLButtonElement>
                    ) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconTrash size={18} />
                  </Button>
                </Group>
              </Grid.Col>
            );
            break;
          default:
            itemRow.push(
              <Grid.Col
                key={key}
                span="auto"
              >
                {item.get(key)}
              </Grid.Col>
            );
            break;
        }
      }

      uiItems.push(
        <Grid
          pos="relative"
          key={item.get("cre_date")}
          onClick={() =>
            toggleShoppingItemStatus({
              shoppingListId: shoppingListId as string,
              shoppingItemId: item.get("_id") as string,
            })
          }
          className={`${classes.item} ${
            isChecked ? "strike" : ""
          }`}
        >
          {itemRow}
        </Grid>
      );
    }

    return uiItems;
  };

  const renderHeader = () => {
    return (
      <Group
        noWrap
        position="apart"
      >
        <Title
          size="h2"
          className="text-ellipsis"
        >
          {shoppingList.title}
        </Title>
      </Group>
    );
  };

  const FullSpanCol: FunctionComponent<PropsWithChildren> = ({
    children,
  }) => {
    return (
      <Grid.Col
        p={0}
        span="auto"
      >
        {children}
      </Grid.Col>
    );
  };

  return (
    <Stack spacing="md">
      <Grid>
        <FullSpanCol>{renderHeader()}</FullSpanCol>
      </Grid>
      <Grid>{renderColumns()}</Grid>
      <Grid>
        <FullSpanCol>
          <Divider />
        </FullSpanCol>
      </Grid>
      {renderItems()}
    </Stack>
  );
};

export default ShoppingListDetail;
