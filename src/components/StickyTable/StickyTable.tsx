import { FunctionComponent, useState } from "react";
import { createStyles, Table, ScrollArea } from "@mantine/core";

const useStyles = createStyles(theme => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: "''",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface StickyTableProps<
  T extends Map<string, string> = Map<string, string>
> {
  columns: T;
  items: T[];
}

const StickyTable: FunctionComponent<StickyTableProps> = ({
  items,
  columns,
}) => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const cols: JSX.Element[] = [];
  for (const [, colLabel] of columns.entries()) {
    cols.push(<th key={colLabel}>{colLabel}</th>);
  }

  const rows: JSX.Element[] = [];
  for (const [index, item] of items.entries()) {
    const row: JSX.Element[] = [];

    for (const [colName] of columns.entries()) {
      row.push(<td key={colName}>{item.get(colName)}</td>);
    }

    rows.push(<tr key={index + 1}>{row}</tr>);
  }

  return (
    <ScrollArea
      sx={{ height: 600 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table sx={{ minWidth: 720 }}>
        <thead
          className={cx(classes.header, {
            [classes.scrolled]: scrolled,
          })}
        >
          <tr>{cols}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};

export default StickyTable;
