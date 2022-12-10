import { Container } from "@mantine/core";
import { FunctionComponent, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { PAGES } from "./";
import HeaderMenu from "../components/HeaderMenu";

const Root: FunctionComponent = () => {
  const { pathname } = useLocation();

  const shouldRenderHeader = useMemo(
    () =>
      pathname !== "/" &&
      pathname !== `/${PAGES.LOGIN}` &&
      pathname !== `/${PAGES.REGISTER}`,
    [pathname]
  );

  const links = [
    {
      url: `/${PAGES.ACCOUNT}`,
      label: "Conta",
      sublinks: [],
    },
  ];

  return (
    <>
      {shouldRenderHeader && <HeaderMenu links={links} />}
      <Container py="lg">
        <Outlet />
      </Container>
    </>
  );
};

export default Root;
