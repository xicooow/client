import { FunctionComponent } from "react";
import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

const Root: FunctionComponent = () => {
  return (
    <Container py="lg">
      <Outlet />
    </Container>
  );
};

export default Root;
