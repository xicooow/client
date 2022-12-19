import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import api from "../api";
import { ShoppingList } from "../types";
import { QUERY_KEYS } from "../constants";

const ShoppingListDetail: FunctionComponent = () => {
  const { shoppingListId } = useParams();

  const { data } = useQuery<ShoppingList, Error>(
    QUERY_KEYS.SHOPPING_LIST,
    async () => {
      const request = api<ShoppingList>(
        `shoppingList/${shoppingListId}`
      );

      return await request();
    }
  );

  return (
    <code>
      <pre>{data && JSON.stringify(data, null, 2)}</pre>
    </code>
  );
};

export default ShoppingListDetail;
