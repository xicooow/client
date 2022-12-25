import dayjs from "dayjs";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { closeAllModals, openModal } from "@mantine/modals";
import {
  IconCheck,
  IconExclamationMark,
  IconMoon,
  IconSun,
} from "@tabler/icons";
import {
  QueryObserverResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  Button,
  Group,
  Mark,
  TextInput,
  Title,
  Switch,
  createStyles,
} from "@mantine/core";
import {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
} from "react";

import api from "../api";
import { useStore } from "../context/store";
import { PAGES, QUERY_KEYS } from "../constants";
import StickyTable from "../components/StickyTable";
import CustomIconLoader from "../components/CustomIconLoader";
import {
  ReducedShoppingLists,
  ShoppingList,
  ShoppingListPayload,
  StringMap,
} from "../types";

const ShoppingListForm: FunctionComponent<{
  refetch: () => Promise<
    QueryObserverResult<ReducedShoppingLists, Error>
  >;
}> = ({ refetch }) => {
  const form = useForm<ShoppingListPayload>({
    initialValues: {
      title: "",
    },
  });

  const mutationFn = async (params: ShoppingListPayload) => {
    const request = api<ShoppingList>("shoppingList", {
      method: "POST",
      body: JSON.stringify(params),
    });

    return await request();
  };

  const { isLoading, mutate: create } = useMutation<
    ShoppingList,
    Error,
    ShoppingListPayload
  >({
    onSuccess: ({ title }: ShoppingList) => {
      showNotification({
        color: "green",
        icon: <IconCheck />,
        message: `Lista ${title} criada com sucesso`,
      });
      closeAllModals();
      refetch();
    },
    onError: () =>
      showNotification({
        color: "red",
        icon: <IconExclamationMark />,
        message: "Erro ao criar lista, tente novamente",
      }),
    mutationFn,
  });

  return (
    <form onSubmit={form.onSubmit(values => create(values))}>
      <TextInput
        required
        type="text"
        label="Nome"
        {...form.getInputProps("title")}
      />
      <Button
        mt="md"
        fullWidth
        type="submit"
        disabled={isLoading || !form.isDirty()}
      >
        {isLoading ? <CustomIconLoader /> : "Criar"}
      </Button>
    </form>
  );
};

const useStyles = createStyles(theme => ({
  filter: {
    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
      alignItems: "stretch",
    },
    [theme.fn.largerThan("sm")]: {
      alignItems: "flex-end",
    },
  },
}));

const ShoppingLists: FunctionComponent = () => {
  const { user } = useStore();
  const { classes } = useStyles();

  const navigate = useNavigate();

  const [filter, setFilter] = useState("");
  const [shoppingLists, setShoppingLists] =
    useState<ReducedShoppingLists>([]);
  const [status, toggleStatus] = useToggle<
    ShoppingList["status"]
  >(["active", "inactive"]);

  const { isFetching, refetch } = useQuery<
    ReducedShoppingLists,
    Error
  >(
    QUERY_KEYS.SHOPPING_LISTS,
    async () => {
      const request = api<ReducedShoppingLists>(
        `shoppingLists?status=${status}`
      );

      return await request();
    },
    {
      enabled: false,
      onSuccess: setShoppingLists,
    }
  );

  useEffect(() => {
    refetch({ cancelRefetch: true });
  }, [status]);

  const items = useMemo(
    () =>
      shoppingLists.reduce<StringMap[]>((previous, current) => {
        if (
          current.title
            .toLowerCase()
            .includes(filter.toLowerCase())
        ) {
          const formatted: typeof current = {
            ...current,
            cre_date: dayjs(current.cre_date).format("lll"),
          };

          previous.push(new Map(Object.entries(formatted)));
        }

        return previous;
      }, []),
    [shoppingLists, filter]
  );

  const columns = new Map([
    ["title", "Lista"],
    ["cre_date", "Data de Criação"],
  ]);

  const statuses = new Map([
    ["active", "ativas"],
    ["inactive", "inativas"],
  ]);

  const isActive = status === "active";
  const statusLabel = statuses.get(status);

  let filterDebounce: number | null = null;

  return (
    <>
      <Group
        noWrap
        position="apart"
      >
        <Title
          size="h2"
          className="text-ellipsis"
        >
          Listas{" "}
          <Mark color={isActive ? "blue" : "gray"}>
            {statusLabel}
          </Mark>{" "}
          do usuário <span title={user.name}>{user.name}</span>
        </Title>
        {isActive && (
          <Button
            ml="auto"
            variant="gradient"
            onClick={() =>
              openModal({
                centered: true,
                title: "Criar nova lista",
                children: <ShoppingListForm refetch={refetch} />,
              })
            }
          >
            Criar Nova
          </Button>
        )}
      </Group>
      <Group
        my="xl"
        className={classes.filter}
      >
        <Switch
          size="lg"
          checked={isActive}
          onChange={() => toggleStatus()}
          onLabel={<IconSun size={20} />}
          offLabel={<IconMoon size={20} />}
        />
        <TextInput
          type="text"
          placeholder="Pesquisar por nome"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (filterDebounce) {
              clearTimeout(filterDebounce);
            }

            filterDebounce = setTimeout(() => {
              clearTimeout(filterDebounce as number);
              setFilter(value);
            }, 500);
          }}
        />
      </Group>
      <StickyTable
        items={items}
        columns={columns}
        loading={isFetching}
        onSelect={item => {
          const shoppingListId = item.get("_id");
          if (shoppingListId) {
            navigate(
              `/${PAGES.SHOPPING_LIST}/${shoppingListId}`
            );
          }
        }}
      />
    </>
  );
};

export default ShoppingLists;
