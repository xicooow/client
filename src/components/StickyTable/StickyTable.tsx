import {
  FunctionComponent,
  PropsWithChildren,
  useState,
} from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  Center,
} from "@mantine/core";
import { IconLoader } from "@tabler/icons";

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

interface StickyTableProps {
  columns: Map<string, string>;
  items: Map<string, string>[];
  loading: boolean;
  captionText?: string;
}

const StickyTable: FunctionComponent<StickyTableProps> = ({
  items,
  columns,
  loading,
  captionText,
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

  const renderTableBody = () => {
    const Placeholder: FunctionComponent<PropsWithChildren> = ({
      children,
    }) => (
      <tr>
        <td colSpan={cols.length}>{children}</td>
      </tr>
    );

    if (loading) {
      return (
        <Placeholder>
          <Center fs="italic">
            Carregando...{" "}
            <IconLoader
              style={{ animation: "spin 2s linear infinite" }}
            />
          </Center>
        </Placeholder>
      );
    }

    if (rows.length === 0) {
      return (
        <Placeholder>
          <Center fs="italic">Sem resultados</Center>
        </Placeholder>
      );
    }

    return rows;
  };

  return (
    <ScrollArea
      sx={{ height: 600 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table
        highlightOnHover
        withColumnBorders
        captionSide="top"
        sx={{ minWidth: 720 }}
      >
        <caption>{captionText || ""}</caption>
        <thead
          className={cx(classes.header, {
            [classes.scrolled]: scrolled,
          })}
        >
          <tr>{cols}</tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </Table>
    </ScrollArea>
  );
};

export default StickyTable;
