import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./EgresosGastos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuentasContales } from "./CuentasContales/CuentasContales";
import { EgresosGastosContext } from "./EgresosGastosContext";
import { FiltroEgresosGastos } from "./FiltroEgresosGastos/FiltroEgresosGastos";
import Modal from "../../../EntryComponents/Modal";
import RegisterAccount from "../../../EntryComponents/RegisterAccount";
import { Account } from "../../../../../type/AccountEntry";
import ApiMethodAccountEntry from "../../../../../Class/api.entryaco";
import { AddEgresosGastos } from "./AddEgresosGastos/AddEgresosGastos";
import { Providers } from "../../../../../type/providers";
import ApiMethodProvider from "../../../../../Class/api.providers";
import { Expense } from "../../../../../type/InvoceExpense";
import ApiMethodInvoceExpense from "../../../../../Class/api.invoceexpe";
import { User } from "../../../../../type/User";
import { CuadroRegistrarEyG } from "./RegistrosEyG/CuadroRegistrarEyG";

const EgresosGastos: FC = () => {
  const { selectedOption, setSelectedOption } = useContext(SmartwaterContext);
  const [data, setData] = useState<{
    accounts?: Account[];
    providers?: Providers[];
    expense?: Expense[];
    users?: User[];
    expeGroup?: Expense[];
  }>();

  const groupExpensesById = (expenses: Expense[]) => {
    const groupedExpenses = expenses.reduce((acc, expense) => {
      // Si ya existe el _id en el acumulador, suma el amount
      if (acc[expense.accountEntry]) {
        acc[expense.accountEntry].amount += expense.amount;
      } else {
        // Si no existe, lo añade al acumulador
        acc[expense.accountEntry] = { ...expense };
      }
      return acc;
    }, {} as { [key: string]: Expense[][0] });

    return Object.values(groupedExpenses);
  };

  const getData = useCallback(async () => {
    const api = new ApiMethodAccountEntry();
    const apiProvi = new ApiMethodProvider();
    const apiex = new ApiMethodInvoceExpense();
    const expenseData = await apiex.loadExpense();
    return setData({
      accounts: await api.loadAccounts(),
      providers: await apiProvi.loadProvider(),
      expense: expenseData,
      users: await api.getUser(),
      expeGroup: groupExpensesById(expenseData),
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
            <div className="flex flex-col gap-4 p-6">
              <div className="RegistrosEyG-Cuadro1">
                {data?.expeGroup &&
                  data.expeGroup.map((row, index) => (
                    <div className="RegistrosEyG-Cuadro1-text" key={index}>
                      <span>
                        {data.accounts?.find((x) => x._id === row.accountEntry)
                          ?.name || "Cuenta no Reconociada"}
                      </span>
                      <span>{row.amount.toLocaleString()} Bs.</span>
                    </div>
                  ))}
              </div>

              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 pl-4">
                {data?.expense &&
                  data?.expense.map((row, index) => (
                    <CuadroRegistrarEyG
                      key={index}
                      expense={row}
                      accounts={data?.accounts}
                      users={data?.users}
                    />
                  ))}
              </div>
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
        <AddEgresosGastos data={data} handleOnsubmit={() => getData()} />
      </Modal>
    </>
  );
};

export { EgresosGastos };
