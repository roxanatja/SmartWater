import { FC } from "react";
import "./EgresosGastos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { CuentasContales } from "./CuentasContales/CuentasContales";
import { useNavigate, useParams } from "react-router-dom";
import RegistroEyG from "./RegistrosEyG/RegistroEyG";

const EgresosGastos: FC = () => {
  const params = useParams()
  const navigate = useNavigate()

  // const groupExpensesById = (expenses: any[]) => {
  //   const groupedExpenses = expenses.reduce((acc, expense) => {
  //     // Si ya existe el _id en el acumulador, suma el amount
  //     if (acc[expense.accountEntry]) {
  //       acc[expense.accountEntry].amount += expense.amount;
  //     } else {
  //       // Si no existe, lo añade al acumulador
  //       acc[expense.accountEntry] = { ...expense };
  //     }
  //     return acc;
  //   }, {} as { [key: string]: any[][0] });

  //   return Object.values(groupedExpenses);
  // };

  // const getData = useCallback(async () => {
  //   const api = new ApiMethodAccountEntry();
  //   const apiProvi = new ApiMethodProvider();
  //   const apiex = new ApiMethodInvoceExpense();
  //   const expenseData = await apiex.loadExpense();
  //   return setData({
  //     accounts: await api.loadAccounts(),
  //     providers: await apiProvi.loadProvider(),
  //     expense: expenseData,
  //     users: await api.getUser(),
  //     expeGroup: groupExpensesById(expenseData),
  //   });
  // }, []);

  // useEffect(() => {
  //   getData();
  // }, [getData]);

  // const { showModal, setShowModal, showFiltro, setShowFiltro } =
  //   useContext(EgresosGastosContext);

  // const handleModal = () => {
  //   setShowModal(true);
  // };

  // const Onfilter = () => {
  //   setShowFiltro(true);
  // };


  if (!params?.section) { return null }
  if (!["Cuentas", "Registro"].includes(params.section)) { navigate("/Finanzas/EgresosGastos/Cuentas", { replace: true }) }

  return (
    <>
      <div className="px-10">
        <PageTitle
          titulo="Finanzas / Cuentas, egresos y gastos"
          icon="../../Finanzas-icon.svg"
        />
        {params.section === "Cuentas" ? (
          <CuentasContales />

        ) : (
          <RegistroEyG />
        )}
      </div>

      {/* {showFiltro && <FiltroEgresosGastos />}

      <Modal
        isOpen={showModal && selectedOption}
        onClose={() => setShowModal(false)}
      >
        <AddEgresosGastos data={data} handleOnsubmit={() => getData()} />
      </Modal> */}
    </>
  );
};

export { EgresosGastos };
