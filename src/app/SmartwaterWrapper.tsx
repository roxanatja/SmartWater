import { FC } from "react";
import { SmartwaterProvider } from "./SmartwaterContext";
import { PaginaPrincipal } from "./pages/PaginaPrincipal/PaginaPrincipal";
import "../index.css";

const SmartwaterWrapper: FC = () => {
  return (
    <>
      <SmartwaterProvider>
        <PaginaPrincipal />
      </SmartwaterProvider>
    </>
  );
};

export { SmartwaterWrapper };
