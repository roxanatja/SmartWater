import { FC } from "react";
import "./EgresosGastos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { CuentasContales } from "./CuentasContales/CuentasContales";
import { useNavigate, useParams } from "react-router-dom";
import RegistroEyG from "./RegistrosEyG/RegistroEyG";

const EgresosGastos: FC = () => {
  const params = useParams()
  const navigate = useNavigate()

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
    </>
  );
};

export { EgresosGastos };
