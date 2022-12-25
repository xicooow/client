/**
 * INTERFACES
 */

export interface Methods {
  cleanup: () => void;
  setUser: (user: State["user"]) => void;
}

export interface Context {
  data: State;
  methods?: Methods;
}

export interface State {
  user: Account;
}

export interface WithId {
  _id: string;
}

export interface CommonShape {
  name: string;
  email: string;
}

export interface Account extends WithId, CommonShape {
  cre_date: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegistryPayload extends CommonShape {
  password: string;
}

export interface HeaderLink {
  url: string;
  label: string;
  sublinks: Pick<HeaderLink, "url" | "label">[];
}

export interface HeaderProps {
  links: HeaderLink[];
}

export interface ShoppingList extends WithId {
  title: string;
  cre_date: string;
  items: ShoppingItem[];
  user: string;
  columns: StringMap;
  status: "active" | "inactive" | "archived";
}

export interface ShoppingItem extends WithId {
  done: boolean;
  fields: StringMap;
  cre_date: string;
}

export interface StickyTableProps {
  columns: StringMap;
  items: StringMap[];
  loading: boolean;
  captionText?: string;
  onSelect?: (item: StringMap) => void;
}

export interface ShoppingItemPayload {
  shoppingListId: string;
  shoppingItemId: string;
}

export interface AnyObject<V = any> {
  [key: string]: V;
}

/**
 * TYPES
 */

export type StringMap = Map<string, string>;

export type Action =
  | {
      type: "SET_USER";
      payload: State["user"];
    }
  | {
      type: "CLEANUP";
    };

export type ReducedShoppingLists = Pick<
  ShoppingList,
  "_id" | "title" | "cre_date"
>[];

export type ShoppingListPayload = Pick<ShoppingList, "title">;
