import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

const ShoppingList: FunctionComponent = () => {
  const { shoppingListId } = useParams();

  return (
    <div>
      Shopping List: {shoppingListId} <br /> <i>TODO...</i>
    </div>
  );
};

export default ShoppingList;
