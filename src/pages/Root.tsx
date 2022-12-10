import { Container } from "@mantine/core";
import { FunctionComponent, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { PAGES } from "./";
import { HEADER_LINKS } from "../constants";
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

  return (
    <>
      {shouldRenderHeader && <HeaderMenu links={HEADER_LINKS} />}
      <Container py="lg">
        <Outlet />
      </Container>
    </>
  );
};

export default Root;
