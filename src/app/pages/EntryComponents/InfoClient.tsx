import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import GetApiMethod from "../../../Class/api.class";
import { Client } from "../../../Class/types.data";
import ApiMethodLoans from "../../../Class/api.loans";
import { Loans } from "../../../type/Loans/Loans";
import { CuadroPrestamo } from "../Contenido/Préstamos/CuadroPrestamo/CuadroPrestamo";
import ApiMethodSales from "../../../Class/api.sales";
import Product from "../../../type/Products/Products";
import { Devolution } from "../../../type/Devolution/devolution";
import ApiMethodDevolu from "../../../Class/api.devolu";

const InfoClient = ({ client }: { client: Client }) => {
  const [city, setCity] = useState<{
    zone: string | undefined;
    district: string | undefined;
    loans?: Loans[];
    product?: Product[];
    devolu?: Devolution[];
    item?: any;
  }>({
    zone: "",
    district: "",
  });
  const [activeinfo, setActiveinfo] = useState<boolean>(true);
  const [activepresta, setActivepresta] = useState<boolean>(true);
  const getZone = useCallback(
    async (zone: string, disc: string, client?: string) => {
      let resload, devo;
      const api = new GetApiMethod();
      const apiloa = new ApiMethodLoans();
      const apiProduc = new ApiMethodSales();
      const apidevu = new ApiMethodDevolu();
      const res = await api.getZone();
      if (client) {
        resload = await apiloa.loadLoans({
          client: client,
        });

        devo = await apidevu.GetDevolutions({ client });
      }
      const zoneData = res.find((x) => x._id === zone);
      return setCity({
        zone: zoneData?.name,
        district: zoneData?.districts.find((x) => x._id === disc)?.name,
        loans: resload,
        product: await apiProduc.GetProducts(),
        devolu: devo,
        item: await apiProduc.getItems(),
      });
    },
    []
  );

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

  useEffect(() => {
    if (client.district) getZone(client.zone, client.district, client._id);
  }, [client._id, client.district, client.zone, getZone]);
  return (
    <div>
      <div className="flex flex-col w-full justify-center items-start gap-4">
        <div className="flex gap-2 items-center">
          <img
            src={client.storeImage}
            alt=""
            className="w-8 h-8 rounded-full"
          />
          <p className="text-sm">{client.fullName || "N/A"}</p>
        </div>

        <div
          className="w-full border-b-2 pb-4 flex justify-between cursor-pointer"
          onClick={() => setActiveinfo(!activeinfo)}
        >
          <h4 className="text-sm font-semibold">Informacion general</h4>
          <i
            className={`fa-solid fa-angle-down transition-all ${
              activeinfo && "rotate-180"
            }`}
          ></i>
        </div>

        {activeinfo && (
          <>
            <div className="w-full flex gap-2 items-center">
              <a
                href={`https://wa.me/${client.phoneNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="items-center flex gap-2"
              >
                <i className="fa-brands fa-whatsapp text-2xl text-green-500"></i>{" "}
                {client.phoneNumber}
              </a>

              <div
                className="items-center flex gap-2 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(client.phoneLandLine || "N/A");
                  toast.success("Línea fija copiada al portapapeles");
                }}
              >
                <i className="fa-solid fa-phone p-2 bg-blue_custom text-white rounded-full"></i>
                {client.phoneLandLine || "N/A"}
              </div>
            </div>

            <a
              href={`https://www.google.com/maps?q=${client.location.latitude},${client.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full items-center flex gap-2"
            >
              <i className="fa-solid fa-location-dot text-2xl text-blue_custom"></i>
              <p>Ubicación en Google Maps</p>
            </a>

            <div className="w-full">
              <ul className="list-none flex flex-col gap-4">
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Codigo:</p>
                  <p>{client.code}</p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Dirrecion:</p>
                  <p>{client.address}</p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Refencia:</p>
                  <p>{client.reference || "N/A"}</p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Refencia:</p>
                  <p>{client.reference || "N/A"}</p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Zona:</p>
                  <p>{city.zone || "N/A"}</p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Barrio:</p>
                  <p>{city.district || "N/A"}</p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Fecha de Registro:</p>
                  <p>{new Date(client.created).toLocaleString() || "N/A"}</p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Ultima venta:</p>
                  <p>
                    {client.lastSale
                      ? new Date(client.lastSale).toLocaleString()
                      : "Sin venta"}
                  </p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Renovacion Promedio:</p>
                  <p>{client.renewInDays || "N/A"}</p>
                </li>
              </ul>
            </div>
          </>
        )}

        <div className="w-full border-b-2 pb-4 flex justify-between cursor-pointer">
          <h4 className="text-sm font-semibold">Carnet frontal</h4>
          <i className={`fa-solid fa-angle-up transition-all`}></i>
        </div>

        <div>
          <img
            src={client.ciFrontImage}
            className="w-80 h-44 rounded-md"
            alt={client.ciFrontImage}
          />
        </div>

        <div className="w-full border-b-2 pb-4 flex justify-between cursor-pointer">
          <h4 className="text-sm font-semibold">Carnet reverso</h4>
          <i className={`fa-solid fa-angle-up transition-all`}></i>
        </div>

        <div>
          <img
            src={client.ciBackImage}
            className="w-80 h-44 rounded-md"
            alt={client.ciBackImage}
          />
        </div>

        <div
          className="w-full border-b-2 pb-4 flex justify-between cursor-pointer"
          onClick={() => setActivepresta(!activepresta)}
        >
          <h4 className="text-sm font-semibold">Prestamo</h4>
          <i
            className={`fa-solid fa-angle-down transition-all ${
              activepresta && "rotate-180"
            }`}
          ></i>
        </div>

        {activepresta && (
          <>
            {!client.hasLoan ? (
              <div className="text-md">
                <b>Actual: </b> Sin prestamos actuales
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 w-full pt-4 ">
                {city.loans &&
                  city.loans.map((loan, index) => {
                    const contratcEstate = getContractState(
                      loan.hasContract,
                      loan.hasExpiredContract
                    );
                    return (
                      <CuadroPrestamo
                        key={index}
                        loan={loan}
                        info
                        productos={city.product || []}
                        estadoContrato={contratcEstate}
                      />
                    );
                  })}
              </div>
            )}
          </>
        )}
        <div className="w-full border-b-2 pb-4 flex justify-between cursor-pointer">
          <h4 className="text-sm font-semibold">Contratos</h4>
          <i className={`fa-solid fa-angle-up transition-all`}></i>
        </div>
        {!client.hasContract && (
          <div className="text-md">
            <b>Actual: </b> Sin contratos
          </div>
        )}
        <div className="w-full border-b-2 pb-4 flex justify-between cursor-pointer">
          <h4 className="text-sm font-semibold">Devoluciones</h4>
          <i className={`fa-solid fa-angle-up transition-all`}></i>
        </div>

        {city.devolu && city.devolu.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 w-full pt-4">
            {city.devolu.map((devolution, index) => (
              <div
                key={devolution._id}
                className="border p-4 rounded-md shadow-sm flex flex-col gap-2"
              >
                <p className="font-semibold">Devolución #{index + 1}</p>
                <p>
                  <b>ID de Préstamo:</b> {devolution.loan}
                </p>
                <p>
                  <b>Fecha de creación:</b>{" "}
                  {new Date(devolution.created).toLocaleDateString()}
                </p>
                <p className="font-semibold">Detalles:</p>
                <ul className="list-none pl-4">
                  {devolution.detail.map((itemDetail, idx) => {
                    const product =
                      city.product &&
                      city.product.find(
                        (product: any) => product._id === itemDetail.item
                      );
                    return (
                      <li
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={product?.imageUrl}
                            alt=""
                            className="w-8 h-8"
                          />
                          {product?.name}
                        </div>
                        <p> Cantidad: {itemDetail.quantity}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay devoluciones registradas.</p>
        )}
      </div>
    </div>
  );
};

export default InfoClient;
