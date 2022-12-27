import { Box } from "@mantine/core";
import { PropsWithChildren, FunctionComponent } from "react";

import { GridLayoutProps } from "../../types";

const GridLayout: FunctionComponent<
  PropsWithChildren<GridLayoutProps>
> = ({ colsSize, styles, className, children }) => {
  const {
    alignItems = "center",
    justifyContent = "center",
    flexFlow = "column nowrap",
  } = styles || {};

  return (
    <Box
      className={className}
      sx={theme => ({
        display: "grid",
        position: "relative",
        gridTemplateColumns: `repeat(${colsSize}, 1fr)`,

        "&>*": {
          flexFlow,
          alignItems,
          justifyContent,
          display: "inline-flex",
          padding: theme.spacing.sm,
        },
      })}
    >
      {children}
    </Box>
  );
};

export default GridLayout;
