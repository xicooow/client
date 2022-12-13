import { FunctionComponent } from "react";
import { IconLoader } from "@tabler/icons";
import { createStyles, keyframes, Text } from "@mantine/core";

const spin = keyframes({
  "from, 0%, to": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

const useStyles = createStyles(() => ({
  loader: {
    animation: `${spin} 2s linear infinite`,
  },
}));

const CustomIconLoader: FunctionComponent<{ text?: string }> = ({
  text,
}) => {
  const { classes } = useStyles();

  return (
    <>
      {text && (
        <Text<"span">
          mr="sm"
          size="md"
        >
          {text}
        </Text>
      )}
      <IconLoader
        cursor="progress"
        className={classes.loader}
      />
    </>
  );
};

export default CustomIconLoader;
