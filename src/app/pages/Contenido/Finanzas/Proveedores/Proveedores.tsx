import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./Proveedores.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { AgregarProveedor } from "./AgregarProveedor/AgregarProveedor";
import { CuadroProveedor } from "./CuadroProveedor/CuadroProveedor";
import { ProveedoresContext } from "./ProveedoresContext";
import { FiltroProveedores } from "./FiltroProveedores/FiltroProveedores";
import Modal from "../../../EntryComponents/Modal";
import { Providers } from "../../../../../type/providers";
import ApiMethodProvider from "../../../../../Class/api.providers";

const Proveedores: FC = () => {
  const { showModal, setShowModal, showFiltro, setShowFiltro } =
    useContext(ProveedoresContext);
  const [provider, setProvider] = useState<Providers[]>([]);

  const getData = useCallback(async () => {
    const api = new ApiMethodProvider();
    const res = await api.loadProvider();
    setProvider(res);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const Onfilter = () => {
    setShowFiltro(true);
  };

  return (
    <>
      <div>
        <PageTitle titulo="Proveedores" icon="../../Finanzas-icon.svg" />
        <FiltroPaginado
          filtro
          resultados
          add
          onAdd={() => setShowModal(true)}
          onFilter={Onfilter}
        >
          <div className="grid grid-cols-4 md:grid-cols-3 max-sm:grid-cols-1 gap-4 p-4">
            {provider.map((row, index) => (
              <CuadroProveedor key={index} provider={row} />
            ))}
          </div>
        </FiltroPaginado>
      </div>
      {showFiltro && <FiltroProveedores />}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          getData();
        }}
      >
        <AgregarProveedor
          onClose={() => {
            setShowModal(false);
            getData();
          }}
        />
      </Modal>
    </>
  );
};

export { Proveedores };
