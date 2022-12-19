import dayjs from "dayjs";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { closeAllModals, openModal } from "@mantine/modals";
import { IconCheck, IconExclamationMark } from "@tabler/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Stack,
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
      alignItems: "stretch",
    },
    [theme.fn.largerThan("sm")]: {
      alignItems: "flex-start",
    },
  },
}));

const ShoppingLists: FunctionComponent = () => {
  const { user } = useStore();
  const { classes } = useStyles();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const isActive = statusParam === "active";

  const [filter, setFilter] = useState("");
  const [shoppingLists, setShoppingLists] =
    useState<ReducedShoppingLists>([]);

  const { isFetching, isFetched, refetch } = useQuery<
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
    if (isFetched && statusParam) {
      refetch();
    }
  }, [statusParam]);

  const items = useMemo(
    () =>
      shoppingLists.reduce<Map<string, string>[]>(
        (previous, current) => {
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
        },
        []
      ),
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

  const status = statuses.get(statusParam as string);

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
            {status}
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
      <Stack
        my="xl"
        className={classes.filter}
      >
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
            }, 750);
          }}
        />
      </Stack>
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
