import { useCallback, useContext, useMemo, useState } from "react";
import { Transaction } from "../../../../../../type/Cash";
import { formatDateTime } from "../../../../../../utils/helpers";
import "./TableArqueoCaja.css";
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from "react-hot-toast";
import Modal from "../../../../EntryComponents/Modal";
import { FinalizarArqueoCaja } from "../FinalizarArqueoCaja/FinalizarArqueoCaja";
import { CashRegisterApiConector } from "../../../../../../api/classes";
import { ArqueoDeCajaContext } from "../ArqueoDeCajaContext";


const TableArqueoCaja = ({ cash }: {
  cash: Transaction[];
}) => {
  const { selectedTransaction, setSelectedTransaction } = useContext(ArqueoDeCajaContext)

  const deleteRegistry = useCallback((id: string) => {
    toast.error(
      (t) => (
        <div>
          <p className="mb-4 text-center text-[#888]">
            Se <b>eliminará</b> este arqueo, <br /> pulsa <b>Proceder</b> para continuar
          </p>
          <div className="flex justify-center">
            <button
              className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
              onClick={() => { toast.dismiss(t.id); }}
            >
              Cancelar
            </button>
            <button
              className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
              onClick={async () => {
                toast.dismiss(t.id);
                const response = await CashRegisterApiConector.delete({ registryId: id }) as any;
                if (!!response) {
                  if (response.mensaje) {
                    toast.success(response.mensaje, {
                      position: "top-center",
                      duration: 2000
                    });
                    window.location.reload();
                  } else if (response.error) {
                    toast.error(response.error, {
                      position: "top-center",
                      duration: 2000
                    });
                  }
                } else {
                  toast.error("Error al eliminar cliente", {
                    position: "top-center",
                    duration: 2000
                  });
                }
              }}
            >
              Proceder
            </button>
          </div>
        </div>
      ),
      {
        className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
        icon: null,
        position: "top-center"
      }
    );
  }, [])


  const columns: TableColumn<Transaction>[] = useMemo<TableColumn<Transaction>[]>(() => [
    {
      name: "Hora de apertura",
      selector: row => (row.startDate ? formatDateTime(row?.startDate, 'numeric', '2-digit', '2-digit', true, true) : "N/A"),
      width: "15%"
    },
    {
      name: "Hora de cierre",
      selector: row => (row.endDate ? formatDateTime(row?.endDate, 'numeric', '2-digit', '2-digit', true, true) : "N/A"),
      width: "15%"
    },
    {
      name: "Distibuidor",
      selector: row => `${row.userDetails?.fullName || "Distribuidor desconocido"} ${row.userDetails?.role === 'admin' ? "(Administrador)" : ""}`,
      width: "30%"
    },
    {
      name: "Sistema",
      selector: row => `${(row?.initialAmount || 0) + (row?.incomeCashTotal || 0) + (row?.creditBillsSales || 0) - ((row?.expenseCashTotal || 0) + (row?.expenseCurrentAccountTotal || 0)) || "N/A"} Bs`,
      width: "10%"
    },
    {
      name: "Diferencia",
      selector: row => `${!row.creationMethod || row.creationMethod === 'open-close' ? "0" : (row?.difference.toLocaleString() || "N/A")} Bs`,
      width: "10%"
    },
    {
      name: "Estado",
      selector: row => row?.state ? "Abierto" : "Cerrado",
      width: "10%"
    },
    {
      name: "Acciones",
      width: "10%",
      cell: (row) =>
        <div className="flex items-center w-full gap-4">
          <button onClick={() => setSelectedTransaction(row)}>
            <i className="fa fa-eye text-blue_bright" aria-hidden="true"></i>
          </button>
          <button onClick={() => deleteRegistry(row._id)}>
            <i className="fa fa-trash text-red-500" aria-hidden="true"></i>
          </button>
        </div>
    }
  ], [deleteRegistry, setSelectedTransaction])

  const [onlyOpen, setOnlyOpen] = useState<boolean>(false)

  return (
    <>
      <div className="text-font-color">
        <DataTable columns={columns}
          actions={<div className="text-sm flex items-center gap-3">
            <input type="checkbox" id="only" checked={onlyOpen} onChange={(e) => { setOnlyOpen(!onlyOpen) }} className="accent-blue_custom" />
            <label htmlFor="only">Mostrar solo abiertos</label>
          </div>}
          className="no-border"
          data={onlyOpen ? cash.filter(c => c.state) : cash}
          pagination={(onlyOpen ? cash.filter(c => c.state) : cash).length > 5}
          paginationPerPage={5}
          noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>}
          paginationComponent={({ currentPage, onChangePage, rowCount, rowsPerPage }) => (<>
            <div className="flex gap-2 w-full justify-end mt-2">
              <>
                <div>
                  <button
                    type="button"
                    className="bg-blue-600 shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed px-2 py-0.5 rounded-sm"
                    onClick={() => onChangePage(currentPage - 1, rowCount)}
                    disabled={currentPage === 1}
                  >
                    <i className="fa-solid fa-angle-left text-white"></i>
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="text-paginado">{`${currentPage} de ${Math.ceil(rowCount / rowsPerPage)} `}</span>
                </div>
                <div>
                  <button
                    type="button"
                    className="bg-blue-600 shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed px-2 py-0.5 rounded-sm"
                    onClick={() => onChangePage(currentPage + 1, rowCount)}
                    disabled={currentPage === Math.ceil(rowCount / rowsPerPage)}
                  >
                    <i className="fa-solid fa-angle-right text-white"></i>
                  </button>
                </div>
              </>
            </div>
          </>)} />
      </div>

      <Modal isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(undefined)} className="w-[90%] lg:w-1/2">
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Detalles de arqueo
        </h2>

        <div className="px-6">
          <FinalizarArqueoCaja cash={selectedTransaction} handleOnSubmit={() => { setSelectedTransaction(undefined); window.location.reload() }} />
        </div>
      </Modal>
    </>
  );
};

export { TableArqueoCaja };
