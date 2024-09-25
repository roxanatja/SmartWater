import { CuadroPrestamo } from "./CuadroPrestamo/CuadroPrestamo";
import { OpcionesPrestamo } from "./CuadroPrestamo/OpcionesPrestamo";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Prestamos.css";
import { FC, useContext, useEffect, useState } from "react";
import { PrestamosContext } from "./PrestamosContext";
import { FiltroPrestamos } from "./FiltroPrestamos/FiltroPrestamos";
import { GetLoans } from "../../../../services/LoansService";
import { GetProducts } from "../../../../services/ProductsService";
import { loadClients } from "../../../../services/ClientsService";
import Product from "../../../../type/Products/Products";

const Prestamos: FC = () => {
  const { showMiniModal, showFiltro, setShowFiltro } =
    useContext(PrestamosContext);
  const [loans, setLoans] = useState<Array<any>>([]);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [clients, setClients] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getLoans();
    getProducts();
  }, []);

  const getLoans = async () => {
    try {
      await GetLoans().then((resp) => {
        setLoans(resp.data);
      });

      setLoading(false);
    } catch (e) {
      console.log(e);
      setError(true);
      setLoading(false);
    }
  };

  const getClients = async () => {
    try {
      await loadClients().then((resp) => {
        setClients(resp.data);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getProducts = async () => {
    try {
      await GetProducts().then((resp) => {
        setProducts(resp.data);
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <p>Cargando Prestamos...</p>;
  }

  if (error) {
    return (
      <p>
        Ocurrio un error en la carga de datos, intentelo nuevamente en unos
        minutos.
      </p>
    );
  }

  const Onfilter = () => {
    setShowFiltro(true);
  };

  const searchLoans = (e: string) => {
    const value = e;

    if (value === "") {
      getLoans();
      getClients();
      return;
    } else {
      let clientFilter = clients.filter((client) =>
        client.fullName?.toLowerCase().includes(value.toLowerCase())
      );
      let loanfilter = clientFilter.flatMap((client) => {
        return loans.filter((loan) => loan.client === client._id);
      });
      setLoans(loanfilter);
    }
  };

  const getContractState = (
    hasContract: boolean,
    hasExpiredContract: boolean
  ) => {
    // This function is used to determine the state of the contract
    if (hasExpiredContract) {
      return "Contrato Vencido";
    } else if (hasContract) {
      return "Con Contrato";
    } else {
      return "Sin Contrato";
    }
  };

  return (
    <>
      <div>
        <PageTitle titulo="Préstamos" icon="./Prestamos-icon.svg" />
        <FiltroPaginado
          filtro
          search={searchLoans}
          resultadosPrestamo
          onFilter={Onfilter}
          total={loans.length}
        >
          <div className="grid grid-cols-3 gap-4 w-full pt-4 ">
            {loans.map((loan, index) => {
              const contratcEstate = getContractState(
                loan.hasContract,
                loan.hasExpiredContract
              );
              return (
                <CuadroPrestamo
                  key={index}
                  loan={loan}
                  productos={products}
                  estadoContrato={contratcEstate}
                />
              );
            })}
          </div>
        </FiltroPaginado>
      </div>
      {showFiltro && <FiltroPrestamos />}
      {showMiniModal && <OpcionesPrestamo />}
    </>
  );
};

export { Prestamos };
