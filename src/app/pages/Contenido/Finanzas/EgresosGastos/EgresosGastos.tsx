import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./EgresosGastos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuentasContales } from "./CuentasContales/CuentasContales";
import { RegistrosEyG } from "./RegistrosEyG/RegistrosEyG";
import { EgresosGastosContext } from "./EgresosGastosContext";
import { FiltroEgresosGastos } from "./FiltroEgresosGastos/FiltroEgresosGastos";
import Modal from "../../../EntryComponents/Modal";
import RegisterAccount from "../../../EntryComponents/RegisterAccount";
import { Account } from "../../../../../type/AccountEntry";
import ApiMethodAccountEntry from "../../../../../Class/api.entryaco";
import { AddEgresosGastos } from "./AddEgresosGastos/AddEgresosGastos";

const EgresosGastos: FC = () => {
  const { selectedOption, setSelectedOption } = useContext(SmartwaterContext);
  const [data, setData] = useState<{ accounts?: Account[] }>();

  const getData = useCallback(async () => {
    const api = new ApiMethodAccountEntry();
    return setData({
      accounts: await api.loadAccounts(),
    });
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const { showModal, setShowModal, showFiltro, setShowFiltro } =
    useContext(EgresosGastosContext);

  const handleModal = () => {
    setShowModal(true);
  };

  const Onfilter = () => {
    setShowFiltro(true);
  };

  useEffect(() => {
    setSelectedOption(false);
  }, [setSelectedOption]);

  return (
    <>
      <div>
        <PageTitle
          titulo="Cuentas Egresos y gastos"
          icon="../../Finanzas-icon.svg"
        />
        {selectedOption === false ? (
          <FiltroPaginado
            filtro
            swith
            finanzas
            opcionesSwitch1="Cuentas contables"
            opcionesSwitch2="Registros Egresos y Gastos"
          >
            <div className="flex flex-wrap gap-4 pl-4">
              <CuentasContales accounts={data?.accounts} />
            </div>
          </FiltroPaginado>
        ) : (
          <FiltroPaginado
            filtro
            swith
            finanzas
            add
            onAdd={handleModal}
            opcionesSwitch1="Cuentas contables"
            opcionesSwitch2="Registros Egresos y Gastos"
            onFilter={Onfilter}
          >
            <div className="flex flex-wrap gap-4 pl-4">
              <RegistrosEyG />
            </div>
          </FiltroPaginado>
        )}
      </div>
      {showFiltro && <FiltroEgresosGastos />}
      <Modal
        isOpen={showModal && !selectedOption}
        onClose={() => setShowModal(false)}
      >
        <RegisterAccount handleOnsubmit={() => getData()} />
      </Modal>
      <Modal
        isOpen={showModal && selectedOption}
        onClose={() => setShowModal(false)}
      >
        <AddEgresosGastos />
      </Modal>
    </>
  );
};

export { EgresosGastos };
