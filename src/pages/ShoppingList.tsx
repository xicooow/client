import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { IconPlus, IconTrash } from "@tabler/icons";
import {
  QueryObserverResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  MouseEvent,
  useMemo,
  useReducer,
  useId,
} from "react";
import {
  Button,
  Center,
  Grid,
  Group,
  Divider,
  createStyles,
  Title,
  TextInput,
  Space,
  Tabs,
} from "@mantine/core";

import api from "../api";
import { QUERY_KEYS } from "../constants";
import SplashScreen from "../components/SplashScreen";
import {
  ShoppingList,
  ShoppingItem,
  ShoppingItemPayload,
  StringMap,
  AnyObject,
} from "../types";

const useStyles = createStyles(theme => ({
  "tab-list": {
    border: "none",
  },
  "tab-option": {
    borderRadius: "unset",

    "&:not([data-active]):hover": {
      border: "none",
    },
  },
  item: {
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
        width: "100%",
        top: "50%",
        left: "0",
      },
    },
  },
}));

const ShoppingItemAddForm: FunctionComponent<
  Pick<ShoppingList, "columns"> &
    Pick<ShoppingItemPayload, "shoppingListId"> & {
      refetch: () => Promise<
        QueryObserverResult<ShoppingList, Error>
      >;
    }
> = ({ columns, shoppingListId, refetch }) => {
  const { cols, initialState } = useMemo(() => {
    const cols = Array.from(columns.entries());
    const initialState = cols.reduce<AnyObject<string>>(
      (previous, current) => {
        const [name] = current;
        previous[name] = "";
        return previous;
      },
      {}
    );

    return {
      cols,
      initialState,
    };
  }, [columns]);

  const reducer = (
    state: typeof initialState,
    action: { name: string; value: string }
  ) => {
    const { name, value } = action;
    return {
      ...state,
      [name]: value,
    };
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const addItem = async (values: typeof state) => {
    const request = api<ShoppingItem>(
      `shoppingList/${shoppingListId}/item`,
      {
        method: "POST",
        body: JSON.stringify({ values }),
      }
    );

    return await request();
  };

  const { mutate: addShoppingItem } = useMutation<
    ShoppingItem,
    Error,
    typeof state
  >({
    onSuccess: () => {
      refetch();
    },
    mutationFn: addItem,
  });

  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addShoppingItem(state);
      }}
    >
      <Group
        grow
        spacing="xl"
      >
        {cols.map(([name, value]) => (
          <TextInput
            key={name}
            label={value}
            value={state[name]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              dispatch({ name, value });
            }}
          />
        ))}
      </Group>
      <Space h="xl" />
      <Group position="right">
        <Button
          type="submit"
          variant="gradient"
          leftIcon={<IconPlus size={18} />}
        >
          Adicionar
        </Button>
      </Group>
    </form>
  );
};

const ShoppingListDetail: FunctionComponent = () => {
  const keyId = useId();
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

  const { mutate: toggleShoppingItemStatus } = useMutation<
    ShoppingItem,
    Error,
    ShoppingItemPayload
  >({
    onSuccess: () => {
      refetch();
    },
    mutationFn: toggleItem,
  });

  const deleteItem = async ({
    shoppingListId,
    shoppingItemId,
  }: ShoppingItemPayload) => {
    const request = api(
      `shoppingList/${shoppingListId}/item/${shoppingItemId}`,
      { method: "DELETE" }
    );

    return await request();
  };

  const { mutate: deleteShoppingItem } = useMutation<
    void,
    Error,
    ShoppingItemPayload
  >({
    onSuccess: () => {
      refetch();
    },
    mutationFn: deleteItem,
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

  if (isFetching || !shoppingList) {
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
      const payloadData: ShoppingItemPayload = {
        shoppingListId: `${shoppingListId}`,
        shoppingItemId: `${item.get("_id")}`,
      };

      for (const key of columns.keys()) {
        switch (key) {
          case "actions":
            itemRow.push(
              <Grid.Col
                span="auto"
                key={keyId}
              >
                <Group
                  noWrap
                  position="left"
                >
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
                      deleteShoppingItem(payloadData);
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
                {item.get(key) || ""}
              </Grid.Col>
            );
            break;
        }
      }

      uiItems.push(
        <Grid
          mb="sm"
          pos="relative"
          key={item.get("_id")}
          onClick={() => toggleShoppingItemStatus(payloadData)}
          className={`${classes.item} clickable ${
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

  return (
    <Tabs defaultValue="list">
      <Tabs.List
        mb="lg"
        className={classes["tab-list"]}
      >
        <Tabs.Tab
          value="list"
          className={classes["tab-option"]}
        >
          Itens
        </Tabs.Tab>
        <Tabs.Tab
          value="form"
          className={classes["tab-option"]}
        >
          Criar Novo
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="list">
        <Grid>
          <Grid.Col span="auto">{renderHeader()}</Grid.Col>
        </Grid>
        <Grid>{renderColumns()}</Grid>
        <Grid my="lg">
          <Grid.Col
            p={0}
            span="auto"
          >
            <Divider />
          </Grid.Col>
        </Grid>
        {renderItems()}
      </Tabs.Panel>
      <Tabs.Panel value="form">
        <ShoppingItemAddForm
          refetch={refetch}
          columns={shoppingList.columns}
          shoppingListId={`${shoppingListId}`}
        />
      </Tabs.Panel>
    </Tabs>
  );
};

export default ShoppingListDetail;
