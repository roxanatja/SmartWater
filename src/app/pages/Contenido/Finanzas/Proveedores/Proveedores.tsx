import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import "./Proveedores.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../../components/FiltroPaginado/FiltroPaginado";
import { AgregarProveedor } from "./AgregarProveedor/AgregarProveedor";
import { CuadroProveedor } from "./CuadroProveedor/CuadroProveedor";
import { ProveedoresContext, providerBlank } from "./ProveedoresContext";
import Modal from "../../../EntryComponents/Modal";
import { Providers } from "../../../../../type/providers";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { ProvidersApiConector } from "../../../../../api/classes";
import { IProvidersGetParams } from "../../../../../api/types/providers";
import { FiltroProveedores } from "./FiltroProveedores/FiltroProveedores";

const Proveedores: FC = () => {
  const { setLoading } = useGlobalContext()
  const { showModal, setShowModal, provider, setProvider, setShowFiltro, showFiltro } = useContext(ProveedoresContext);

  const itemsPerPage: number = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const ITEMS_PER_PAGE = 15

  const [searchParam, setSearchParam] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<IProvidersGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)

  const [usersToShow, setUsersToShow] = useState<Providers[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Providers[]>([])
  const [users, setUsers] = useState<Providers[]>([])

  const [allProviders, setAllProviders] = useState<Providers[]>([])

  const getData = useCallback(async () => {
    setLoading(true)

    let datProvs = await ProvidersApiConector.get({ pagination: { page: 1, pageSize: 3000, sort }, filters: { ...savedFilters } });
    const provs = datProvs?.data || []
    setUsers(provs);
    setTotalPage(Math.ceil((provs.length || 0) / itemsPerPage)); // Update total pages

    setLoading(false)
  }, [setLoading, sort, savedFilters]);

  useEffect(() => {
    ProvidersApiConector.get({ pagination: { page: 1, pageSize: 3000 } }).then(res => setAllProviders(res?.data || []))
  }, [])

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (users) {
      const itms = users.filter(d =>
        d.fullName.toLowerCase().includes(searchParam.toLowerCase())
        || (!!d.phoneNumber && d.phoneNumber.toLowerCase().includes(searchParam.toLowerCase())))
      setFilteredUsers(itms);
      setTotalPage(Math.ceil(itms.length / ITEMS_PER_PAGE))
      setCurrentPage(1);
    }
  }, [users, searchParam])

  useEffect(() => {
    if (filteredUsers) {
      setUsersToShow(filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE)))
    }
  }, [filteredUsers, currentPage])

  const orderArray = (orden: string) => {
    if (orden === "new") {
      setSort('desc')
    } else if (orden === "older") {
      setSort('asc')
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filters: IProvidersGetParams['filters']) => {
    setCurrentPage(1);
    setSavedFilters(filters);
  };

  return (
    <>
      <div className="px-10">
        <PageTitle titulo="Proveedores" icon="../../Finanzas-icon.svg" />
        <FiltroPaginado
          ref={filterRef}
          add
          onAdd={() => setShowModal(true)}
          paginacion
          totalPage={totalPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          resultados
          filtro={true}
          onFilter={() => setShowFiltro(true)}
          hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
          total={filteredUsers.length}
          search={setSearchParam}
          orderArray={orderArray}
          searchPlaceholder="Buscar por texto"
        >
          {
            usersToShow.length > 0 &&
            <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 pb-10 overflow-x-hidden">
              {usersToShow.map((prov) => (
                <CuadroProveedor key={prov._id} provider={prov} />
              ))}
            </div>
          }
          {
            usersToShow.length === 0 &&
            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
              Sin resultados
            </div>
          }
        </FiltroPaginado>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Registrar Proveedor
        </h2>
        <AgregarProveedor
          onClose={() => {
            setShowModal(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={provider._id !== "" && !showModal}
        onClose={() => setProvider(providerBlank)}
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Editar Proveedor
        </h2>
        <AgregarProveedor
          onClose={() => {
            setProvider(providerBlank)
            setShowModal(false);
          }}
        />
      </Modal>

      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroProveedores
          providers={allProviders}
          onChange={handleFilterChange}
          initialFilters={savedFilters}
        />
      </Modal>
    </>
  );
};

export { Proveedores };
