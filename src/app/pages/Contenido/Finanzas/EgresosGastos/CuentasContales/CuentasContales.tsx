import "./CuentasContales.css";
import { FiltroPaginado } from "../../../../components/FiltroPaginado/FiltroPaginado";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { account, EgresosGastosContext } from "../EgresosGastosContext";
import { Account } from "../../../../../../type/AccountEntry";
import { AccountEntryApiConector } from "../../../../../../api/classes";
import CuentasItem from "./CuentasItem";
import Modal from "../../../../EntryComponents/Modal";
import RegisterAccount from "../../../../EntryComponents/RegisterAccount";

const CuentasContales = () => {
  const { setLoading } = useGlobalContext()
  const { showModal, setShowModal, selectedAccount, setSelectedAccount } = useContext(EgresosGastosContext)
  const navigate = useNavigate()

  const [searchParam, setSearchParam] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 15

  const [usersToShow, setUsersToShow] = useState<Account[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Account[]>([])
  const [users, setUsers] = useState<Account[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)

    const res = await AccountEntryApiConector.get()
    const prods = res || []
    setUsers(prods)
    setTotalPages(Math.ceil(prods.length / ITEMS_PER_PAGE))

    setLoading(false)
  }, [setLoading])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (users) {
      const itms = users.filter(d => d.name.toLowerCase().includes(searchParam.toLowerCase()))
      setFilteredUsers(itms);
      setTotalPages(Math.ceil(itms.length / ITEMS_PER_PAGE))
      setPage(1);
    }
  }, [users, searchParam])

  useEffect(() => {
    if (filteredUsers) {
      setUsersToShow(filteredUsers.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
    }
  }, [filteredUsers, page])

  return (
    <>
      <FiltroPaginado
        add
        paginacion={totalPages > 1}
        totalPage={totalPages}
        currentPage={page}
        handlePageChange={setPage}
        onAdd={() => setShowModal(true)}
        filtro={false}
        resultados
        order={false}
        total={filteredUsers.length}
        search={setSearchParam}
        searchPlaceholder="Buscar por nombre"
      >
        <div className="w-full pb-10 sticky top-0 bg-main-background z-[20]">
          <div className="w-full sm:w-1/2">
            <div className="switch-contenido">
              <div
                className={`switch-option selected`}
                onClick={() => navigate("/Finanzas/EgresosGastos/Cuentas")}
              >
                Cuentas contables
              </div>
              <div
                className={`switch-option`}
                onClick={() => navigate("/Finanzas/EgresosGastos/Registro")}
              >
                Registros Egresos y Gastos
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          {
            usersToShow.length > 0 &&
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {
                usersToShow.map(p => <CuentasItem key={p._id} account={p} />)
              }
            </div>
          }
          {
            usersToShow.length === 0 &&
            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
              Sin resultados
            </div>
          }
        </div>
        <div className="flex flex-wrap gap-4 pl-4">
        </div>
      </FiltroPaginado>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Registrar cuenta contable
        </h2>
        <RegisterAccount onCancel={() => setShowModal(false)} />
      </Modal>

      <Modal
        isOpen={selectedAccount._id !== ""}
        onClose={() => { setSelectedAccount(account); setShowModal(false) }}
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Editar cuenta contable
        </h2>
        <RegisterAccount
          onCancel={() => { setSelectedAccount(account); setShowModal(false) }} />
      </Modal>
    </>
  );
};

export { CuentasContales };
