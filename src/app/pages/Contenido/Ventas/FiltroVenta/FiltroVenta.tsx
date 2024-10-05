import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Sale } from "../../../../../type/Sale/Sale";
import { VentasContext } from "../VentasContext";

const FiltroVenta = ({
  sales,
  onChange,
}: {
  sales: Sale[];
  onChange?: (val: Sale[]) => void;
}) => {
  const { register, handleSubmit } = useForm();
  const { setShowFiltro } = useContext(VentasContext);

  const onSubmit = (data: any) => {
    const filteredSales = sales?.filter((sale) => {
      const {
        fechaDesde,
        fechaHasta,
        ventaCredito,
        ventaContado,
        conFactura,
        sinFactura,
        conPrestamo,
        sinPrestamo,
        conContrato,
        sinContrato,
      } = data;

      const saleDate = new Date(sale.created); // Supone que `created` es un string en formato ISO
      const startDate = fechaDesde ? new Date(fechaDesde) : null;
      const endDate = fechaHasta ? new Date(fechaHasta) : null;

      // Filtrar por fecha
      const dateFilter =
        (startDate ? saleDate >= startDate : true) &&
        (endDate ? saleDate <= endDate : true);

      // Filtrar por tipo de venta
      const saleTypeFilter =
        (ventaCredito ? sale.creditSale === true : true) &&
        (ventaContado ? sale.creditSale === false : true);

      // Filtrar por factura
      const invoiceFilter =
        (conFactura ? sale.detail.some((item) => item.price > 0) : true) && // Supone que si hay un precio es con factura
        (sinFactura ? sale.detail.every((item) => item.price === 0) : true);

      // Filtrar por clientes
      const clientFilter =
        (conPrestamo ? sale.client.some((client) => client.hasLoan) : true) &&
        (sinPrestamo ? !sale.client.some((client) => client.hasLoan) : true) &&
        (conContrato
          ? sale.client.some((client) => client.hasContract)
          : true) &&
        (sinContrato
          ? !sale.client.some((client) => client.hasContract)
          : true);

      return dateFilter && saleTypeFilter && invoiceFilter && clientFilter;
    });

    // Llama a onChange si está definido para actualizar las ventas filtradas
    if (onChange) {
      onChange(filteredSales);
    }
    setShowFiltro(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6">
        <h2 className="text-lg font-bold text-blue_custom">Filtrar</h2>
        <div className="p-4">
          <div className="FiltroVenta-FechaContainer">
            <h4 className="FiltroVenta-titulos text-md font-semibold">
              Fechas
            </h4>
            <div className="FiltroVenta-Fechascontainer grid grid-cols-2 gap-4 w-full">
              <div className="FiltroVenta-Fecha w-full">
                <label className="block">De</label>
                <div className="FiltroVenta-FechaInput flex items-center justify-between border-gray-300 p-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="24"
                    viewBox="0 0 22 24"
                    fill="none"
                  >
                    <path
                      d="M19.2 2.4H18V0H15.6V2.4H6V0H3.6V2.4H2.4C1.068 2.4 0 3.468 0 4.8V21.6C0 22.2365 0.252856 22.847 0.702944 23.2971C1.15303 23.7471 1.76348 24 2.4 24H19.2C20.52 24 21.6 22.92 21.6 21.6V4.8C21.6 4.16348 21.3471 3.55303 20.8971 3.10294C20.447 2.65286 19.8365 2.4 19.2 2.4ZM19.2 21.6H2.4V8.4H19.2V21.6ZM10.8 19.2V16.8H6V13.2H10.8V10.8L15.6 15L10.8 19.2Z"
                      fill="black"
                    />
                  </svg>
                  <input
                    type="date"
                    {...register("fechaDesde")}
                    className="ml-2 border-none outline-none"
                  />
                </div>
              </div>
              <div className="FiltroVenta-Fecha w-full">
                <label className="block">A</label>
                <div className="FiltroVenta-FechaInput flex items-center justify-between border-gray-300 p-2 rounded">
                  <img src="/factura.svg" alt="" className="w-5 h-5" />
                  <input
                    type="date"
                    {...register("fechaHasta")}
                    className="ml-2 border-none outline-none"
                  />
                </div>
              </div>
            </div>
            <h4 className="FiltroVenta-titulos text-md font-semibold">
              Ventas
            </h4>
            <div className="FiltroVenta-itemCheckContainer">
              <div className="FiltroVenta-itemCheck flex justify-between items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("ventaCredito")}
                  />
                  <span>A crédito</span>
                </div>
              </div>
              <div className="FiltroVenta-itemCheck flex justify-between items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("ventaContado")}
                  />
                  <span>De contado</span>
                </div>
              </div>
            </div>
            <div className="FiltroVenta-titulos">
              <span>Factura</span>
            </div>
            <div className="FiltroVenta-itemCheckContainer">
              <div className="FiltroVenta-itemCheck flex items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("conFactura")}
                  />
                  <img
                    src="./archivo-factura-dolar.svg"
                    alt=""
                    className="w-5 h-5"
                  />
                  <span>Con Factura</span>
                </div>
              </div>
              <div className="FiltroVenta-itemCheck flex items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("sinFactura")}
                  />
                  <img
                    src="/nofactura.svg"
                    alt="/nofactura.svg"
                    className="w-5 h-5"
                  />
                  <span>Sin Factura</span>
                </div>
              </div>
            </div>
            <div className="FiltroVenta-titulos">
              <span>De Clientes</span>
            </div>
            <div className="FiltroVenta-itemCheckContainer">
              <div className="FiltroVenta-itemCheck flex justify-between items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("conPrestamo")}
                  />
                  <img
                    src="/presta.svg"
                    alt="/presta.svg"
                    className="w-5 h-5"
                  />
                  <span>Con préstamo</span>
                </div>
              </div>
              <div className="FiltroVenta-itemCheck flex justify-between items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("sinPrestamo")}
                  />
                  <img
                    src="/nopresta.svg"
                    alt="/presta.svg"
                    className="w-5 h-5"
                  />
                  <span>Sin Préstamo</span>
                </div>
              </div>
              <div className="FiltroVenta-itemCheck flex justify-between items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("conContrato")}
                  />
                  <img
                    src="/concontrato.svg"
                    alt="/concontrato.svg"
                    className="w-5 h-5"
                  />
                  <span>Con contrato</span>
                </div>
              </div>
              <div className="FiltroVenta-itemCheck flex justify-between items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("sinContrato")}
                  />
                  <img
                    src="/nopresta.svg"
                    alt="/nopresta.svg"
                    className="w-5 h-5"
                  />
                  <span>Sin contrato</span>
                </div>
              </div>
            </div>
            <div className="FiltroVenta-titulos">
              <span>Distribuidores</span>
            </div>
            <div className="FiltroVenta-itemCheckContainer">
              <div className="FiltroVenta-itemCheck flex justify-between items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("distribuidor1")}
                  />
                  <span>Distribuidor 1</span>
                </div>
              </div>
              <div className="FiltroVenta-itemCheck flex justify-between items-center">
                <div className="FiltroVenta-item">
                  <input
                    className="input-check"
                    type="checkbox"
                    {...register("distribuidor2")}
                  />
                  <span>Distribuidor 2</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full items-center">
              <button
                type="button"
                onClick={() => {
                  setShowFiltro(false);
                  if (onChange) onChange(sales);
                }}
                className="mt-4 border-blue-500 border-2 rounded-full px-4 py-2 text-blue_custom font-bold"
              >
                Quitar Filtros
              </button>
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white rounded-full px-4 py-2"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FiltroVenta;
