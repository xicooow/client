import { FunctionComponent } from "react";
import { Skeleton, Stack } from "@mantine/core";

import { HEADER_HEIGHT } from "../../constants";

const SplashScreen: FunctionComponent = () => {
  return (
    <Stack mt={HEADER_HEIGHT + HEADER_HEIGHT * 0.25}>
      <Skeleton
        mb="xl"
        mx="auto"
        width="25%"
        height={36}
      />
      <Skeleton
        radius="xl"
        height={18}
      />
      <Skeleton
        radius="xl"
        height={18}
      />
      <Skeleton
        radius="xl"
        width="75%"
        height={18}
      />
    </Stack>
  );
};

export default SplashScreen;
