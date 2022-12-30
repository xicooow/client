import dayjs from "dayjs";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconArchive,
  IconHandStop,
  IconTrash,
} from "@tabler/icons";
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
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  Button,
  Center,
  Text,
  Group,
  Divider,
  createStyles,
  Title,
  TextInput,
  Space,
  Tabs,
  ScrollArea,
  NumberInput,
  Mark,
  Accordion,
} from "@mantine/core";

import api from "../api";
import GridLayout from "../components/GridLayout";
import SplashScreen from "../components/SplashScreen";
import CustomIconLoader from "../components/CustomIconLoader";
import { PAGES, QUERY_KEYS, currencyFormat } from "../constants";
import {
  ShoppingList,
  ShoppingItem,
  ShoppingItemPayload,
  ShoppingListUpdatePayload,
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
  Pick<ShoppingList, "columns"> & {
    shoppingListId: string;
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

  const { isLoading: isSaving, mutate: addShoppingItem } =
    useMutation<ShoppingItem, Error, typeof state>({
      onSuccess: () => {
        refetch();
      },
      mutationFn: async (values: typeof state) => {
        const request = api<ShoppingItem>(
          `shoppingList/${shoppingListId}/item`,
          {
            method: "POST",
            body: JSON.stringify({ values }),
          }
        );

        return await request();
      },
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
        {cols.map(([name, value]) => {
          if (name === "price") {
            return (
              <NumberInput
                min={0}
                required
                key={name}
                step={0.05}
                label={value}
                precision={2}
                decimalSeparator=","
                disabled={isSaving}
                value={Number(state[name])}
                onChange={(value?: number) => {
                  dispatch({ name, value: `${value}` });
                }}
              />
            );
          }

          return (
            <TextInput
              required
              key={name}
              label={value}
              value={state[name]}
              disabled={isSaving}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                dispatch({ name, value });
              }}
            />
          );
        })}
      </Group>
      <Space h="xl" />
      <Group position="right">
        <Button
          type="submit"
          variant="gradient"
          disabled={isSaving}
        >
          {isSaving ? <CustomIconLoader /> : "Adicionar"}
        </Button>
      </Group>
    </form>
  );
};

const ShoppingListDetail: FunctionComponent = () => {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { shoppingListId } = useParams();

  const { data, isLoading, isFetching, refetch } = useQuery<
    ShoppingList,
    Error
  >(QUERY_KEYS.SHOPPING_LIST, async () => {
    const request = api<ShoppingList>(
      `shoppingList/${shoppingListId}`
    );

    return await request();
  });

  const {
    isLoading: isEditing,
    mutate: toggleShoppingItemStatus,
  } = useMutation<ShoppingItem, Error, ShoppingItemPayload>({
    onSuccess: () => {
      refetch();
    },
    mutationFn: async ({
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
    },
  });

  const { isLoading: isDeleting, mutate: deleteShoppingItem } =
    useMutation<void, Error, ShoppingItemPayload>({
      onSuccess: () => {
        refetch();
      },
      mutationFn: async ({
        shoppingItemId,
      }: ShoppingItemPayload) => {
        const request = api(
          `shoppingList/${shoppingListId}/item/${shoppingItemId}`,
          { method: "DELETE" }
        );

        return await request();
      },
    });

  const { isLoading: isChanging, mutate: updateShoppingItem } =
    useMutation<
      ShoppingList,
      Error,
      Partial<ShoppingListUpdatePayload>
    >({
      onSuccess: ({ title, status }: ShoppingList) => {
        if (status === "archived") {
          showNotification({
            color: "gray",
            autoClose: 3000,
            icon: <IconArchive />,
            message: `Lista ${title} arquivada com sucesso.`,
          });
          navigate(`/${PAGES.SHOPPING_LISTS}`);
        } else {
          refetch();
        }
      },
      mutationFn: async (
        data: Partial<ShoppingListUpdatePayload>
      ) => {
        const request = api<ShoppingList>(
          `shoppingList/${shoppingListId}`,
          { method: "PATCH", body: JSON.stringify(data) }
        );

        return await request();
      },
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

  const { sum, total } = useMemo(() => {
    let sum = 0,
      total = 0;

    if (shoppingList) {
      sum = shoppingList.items.length;
      total = shoppingList.items.reduce(
        (previous, { fields }) => {
          const price = fields.get("price");
          if (price) {
            previous = previous + Number(price);
          }
          return previous;
        },
        0
      );
    }

    return { sum, total };
  }, [shoppingList?.items.length]);

  useEffect(() => {
    if (shoppingList?.status === "archived") {
      showNotification({
        color: "red",
        autoClose: 3000,
        icon: <IconHandStop />,
        message: "Essa lista foi arquivada.",
      });
      navigate(`/${PAGES.SHOPPING_LISTS}`);
    }
  }, [shoppingList?.status]);

  if (isLoading || !shoppingList) {
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
        <Text
          p={8}
          fw={600}
          key={value}
        >
          {value}
        </Text>
      );
    }

    return uiColumns;
  };

  const renderItemText = (key: string, value?: string) => {
    switch (key) {
      case "price":
        return currencyFormat(Number(value || 0));
      default:
        return value;
    }
  };

  const renderItems = () => {
    if (items.length === 0) {
      return [
        <Center
          mt="lg"
          key="empty"
          fs="italic"
        >
          Sem resultados
        </Center>,
      ];
    }

    const uiItems: JSX.Element[] = [];

    for (const item of items) {
      const payloadData: ShoppingItemPayload = {
        shoppingItemId: `${item.get("_id")}`,
      };

      const itemRow: JSX.Element[] = [];
      const isChecked = item.get("done") === "true";

      for (const key of columns.keys()) {
        switch (key) {
          case "actions":
            itemRow.push(
              <Center key={crypto.randomUUID()}>
                <Button
                  px={8}
                  size="xs"
                  color="red"
                  title="Deletar"
                  hidden={isChecked}
                  disabled={
                    isFetching || isEditing || isDeleting
                  }
                  onClick={(
                    e: MouseEvent<HTMLButtonElement>
                  ) => {
                    e.stopPropagation();
                    deleteShoppingItem(payloadData);
                  }}
                >
                  <IconTrash size={18} />
                </Button>
              </Center>
            );
            break;
          default:
            itemRow.push(
              <Text
                key={key}
                onClick={() => {
                  if (!isFetching && !isEditing && !isDeleting) {
                    toggleShoppingItemStatus(payloadData);
                  }
                }}
              >
                {renderItemText(key, item.get(key))}
              </Text>
            );
            break;
        }
      }

      let itemRowClasses = `clickable ${classes.item}`;
      if (isChecked) {
        itemRowClasses += " strike";
      }

      uiItems.push(
        <GridLayout
          key={item.get("_id")}
          colsSize={columns.size}
          className={itemRowClasses}
        >
          {itemRow}
        </GridLayout>
      );
    }

    return uiItems;
  };

  const renderSummary = () => {
    return (
      <Group
        grow
        position="center"
      >
        <Text align="center">
          Qtd: <strong>{sum}</strong>
        </Text>
        <Text align="center">
          Total:{" "}
          <Mark color={`${total <= 100 ? "green" : "red"}`}>
            {currencyFormat(total)}
          </Mark>
        </Text>
      </Group>
    );
  };

  return (
    <>
      <Group
        mb="lg"
        align="center"
        position="apart"
      >
        <Title
          size="h2"
          className="text-ellipsis"
        >
          {shoppingList.title}
        </Title>
        {(isFetching ||
          isEditing ||
          isChanging ||
          isDeleting) && <CustomIconLoader />}
      </Group>
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
          <Tabs.Tab
            value="config"
            className={classes["tab-option"]}
          >
            Configurações
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="list">
          <GridLayout colsSize={columns.size}>
            {renderColumns()}
          </GridLayout>
          <Divider />
          <ScrollArea
            scrollHideDelay={750}
            h="calc(100vh / 1.75)"
          >
            {renderItems()}
          </ScrollArea>
          {renderSummary()}
        </Tabs.Panel>
        <Tabs.Panel value="form">
          <ShoppingItemAddForm
            refetch={refetch}
            columns={shoppingList.columns}
            shoppingListId={`${shoppingListId}`}
          />
        </Tabs.Panel>
        <Tabs.Panel value="config">
          <Accordion
            radius="md"
            variant="filled"
            defaultValue="customization"
          >
            <Accordion.Item value="customization">
              <Accordion.Control>Costumização</Accordion.Control>
              <Accordion.Panel>
                <Text>Alterar estado da lista</Text>
                <Group
                  grow
                  mt="md"
                >
                  {shoppingList.status === "active" && (
                    <Button
                      color="indigo"
                      variant="outline"
                      disabled={isChanging}
                      onClick={() =>
                        updateShoppingItem({
                          status: "inactive",
                        })
                      }
                    >
                      Desativar
                    </Button>
                  )}
                  {shoppingList.status === "inactive" && (
                    <Button
                      color="blue"
                      variant="outline"
                      disabled={isChanging}
                      onClick={() =>
                        updateShoppingItem({
                          status: "active",
                        })
                      }
                    >
                      Ativar
                    </Button>
                  )}
                  <Button
                    color="red"
                    variant="outline"
                    disabled={
                      isChanging ||
                      shoppingList.status === "active"
                    }
                    onClick={() =>
                      openConfirmModal({
                        title: `Arquivar "${shoppingList.title}"`,
                        centered: true,
                        children: (
                          <>
                            <Text size="sm">
                              Tem certeza que deseja{" "}
                              <strong>ARQUIVAR</strong> essa
                              lista?
                            </Text>
                            <Text
                              size="sm"
                              color="red"
                            >
                              Esta ação não pode ser desfeita.
                            </Text>
                          </>
                        ),
                        labels: {
                          cancel: "Cancelar",
                          confirm: "Sim, quero arquivar",
                        },
                        confirmProps: {
                          fw: "normal",
                          color: "red",
                        },
                        cancelProps: {
                          fw: "normal",
                        },
                        onConfirm: () =>
                          updateShoppingItem({
                            status: "archived",
                          }),
                      })
                    }
                  >
                    Arquivar
                  </Button>
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default ShoppingListDetail;
