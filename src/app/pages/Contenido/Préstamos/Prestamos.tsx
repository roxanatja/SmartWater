import { CuadroPrestamo } from "./CuadroPrestamo/CuadroPrestamo";
import { OpcionesPrestamo } from "./CuadroPrestamo/OpcionesPrestamo";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Prestamos.css";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { PrestamosContext } from "./PrestamosContext";
import { FiltroPrestamos } from "./FiltroPrestamos/FiltroPrestamos";
import { GetLoans } from "../../../../services/LoansService";
import { GetProducts } from "../../../../services/ProductsService";
import Product from "../../../../type/Products/Products";
import { Loans } from "../../../../type/Loans/Loans";

const Prestamos: FC = () => {
  const { showMiniModal, showFiltro, setShowFiltro } =
    useContext(PrestamosContext);
  const [loans, setLoans] = useState<Array<Loans>>([]);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const itemsPerPage: number = 9;
  const [currentData, setCurrentData] = useState<Loans[]>([]);

  const getLoans = useCallback(async () => {
    try {
      await GetLoans().then((resp) => {
        setLoans(resp.data);
        setCurrentData(resp.data.slice(0, itemsPerPage));
        setTotalPage(Math.ceil(resp.data.length / itemsPerPage));
        setCurrentPage(1);
      });

      setLoading(false);
    } catch (e) {
      console.log(e);
      setError(true);
      setLoading(false);
    }
  }, []);

  const getProducts = useCallback(async () => {
    try {
      await GetProducts().then((resp) => {
        setProducts(resp.data);
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getLoans();
    getProducts();
  }, [getLoans, getProducts]);

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
      setCurrentData(loans.slice(0, itemsPerPage));
      setTotalPage(Math.ceil(loans.length / itemsPerPage));
      setCurrentPage(1);
      return;
    } else {
      let clientFilter = loans.filter(
        (loan) =>
          loan.client?.[0]?.fullName
            ?.toLowerCase()
            .includes(value.toLowerCase()) || null
      );
      setCurrentData(clientFilter.slice(0, itemsPerPage));
      setTotalPage(Math.ceil(clientFilter.length / itemsPerPage));
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex: number = (page - 1) * itemsPerPage;
    const endIndex: number = startIndex + itemsPerPage;
    setCurrentData(loans.slice(startIndex, endIndex));
  };

  const getContractState = (
    hasContract: boolean,
    hasExpiredContract: boolean
  ) => {
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
          paginacion={true}
          totalPage={totalPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          onFilter={Onfilter}
          total={loans.length}
        >
          <div className="grid grid-cols-3 gap-4 w-full pt-4 ">
            {currentData.map((loan, index) => {
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
