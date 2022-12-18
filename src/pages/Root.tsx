import { Container } from "@mantine/core";
import { Outlet, useLocation } from "react-router-dom";
import {
  FunctionComponent,
  useMemo,
  Suspense,
  lazy,
} from "react";

import { HEADER_LINKS, PAGES } from "../constants";
import SplashScreen from "../components/SplashScreen";

const HeaderMenu = lazy(
  () => import("../components/HeaderMenu")
);

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
      {shouldRenderHeader && (
        <Suspense>
          <HeaderMenu links={HEADER_LINKS} />
        </Suspense>
      )}
      <Container py="lg">
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </Container>
    </>
  );
};

export default Root;
