import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loans } from "../../../type/Loans/Loans";
import { CuadroPrestamo } from "../Contenido/Préstamos/CuadroPrestamo/CuadroPrestamo";
import Product from "../../../type/Products/Products";
import { Devolution } from "../../../type/Devolution/devolution";
import { Client } from "../../../type/Cliente/Client";
import { formatDateTime } from "../../../utils/helpers";
import { DevolutionsApiConector, ItemsApiConector, LoansApiConector, ProductsApiConector, ZonesApiConector } from "../../../api/classes";
import { Zone } from "../../../type/City";

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
  const [activepresta, setActivepresta] = useState<boolean>(false);
  const [activecarnet, setActivecarnet] = useState<boolean>(true);
  const [activeContracts, setActiveContracts] = useState<boolean>(false);
  const [activeDevol, setActiveDevol] = useState<boolean>(false);

  const getZone = useCallback(
    async (zone: string, disc: string, client?: string) => {
      let resload: Loans[] = []; let devo: Devolution[] = [];
      const zones: Zone[] = (await ZonesApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];

      if (client) {
        resload = (await LoansApiConector.get({ filters: { client: client }, pagination: { page: 1, pageSize: 3000 } }))?.data || [];
        devo = (await DevolutionsApiConector.get({ filters: { client: client }, pagination: { page: 1, pageSize: 3000 } }))?.data || [];
      }

      const zoneData = zones.find((x) => x._id === zone);
      return setCity({
        zone: zoneData?.name,
        district: zoneData?.districts.find((x) => x._id === disc)?.name,
        loans: resload,
        product: (await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [],
        devolu: devo,
        item: (await ItemsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [],
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
    <div className="pb-10">
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
            className={`fa-solid fa-angle-down transition-all ${activeinfo && "rotate-180"
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
                  <p className="font-medium">Referencia:</p>
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
                  <p>{client.created ? formatDateTime(client.created, 'numeric', '2-digit', '2-digit', true) : "N/A"}</p>
                </li>
                <li className="flex gap-2 text-base">
                  <p className="font-medium">Ultima venta:</p>
                  <p>
                    {client.lastSale
                      ? formatDateTime(client.lastSale, 'numeric', '2-digit', '2-digit', true)
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

        <div className="w-full border-b-2 pb-4 flex justify-between cursor-pointer" onClick={() => setActivecarnet(!activecarnet)}>
          <h4 className="text-sm font-semibold">Carnet</h4>
          <i className={`fa-solid fa-angle-down transition-all ${activecarnet && "rotate-180"}`}></i>
        </div>

        {
          activecarnet &&
          <div className="flex gap-4 justify-between">
            <div className="flex flex-col gap-2 items-center">
              <img
                src={client.ciFrontImage || ''}
                className="w-80 h-44 rounded-md flex-1"
                alt={client.ciFrontImage}
              />
              <small className="text-gray-500 w-fit">Frontal</small>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <img
                src={client.ciBackImage || ''}
                className="w-80 h-44 rounded-md flex-1"
                alt={client.ciBackImage}
              />
              <small className="text-gray-500 w-fit">Reverso</small>
            </div>
          </div>
        }

        <div
          className="w-full border-b-2 pb-4 flex justify-between cursor-pointer"
          onClick={() => setActivepresta(!activepresta)}
        >
          <h4 className="text-sm font-semibold">Prestamo</h4>
          <i
            className={`fa-solid fa-angle-down transition-all ${activepresta && "rotate-180"}`}
          ></i>
        </div>

        {activepresta && (
          <>
            {!client.hasLoan ? (
              <div className="text-md">
                <b>Actual: </b> Sin prestamos actuales
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full pt-4 ">
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

        <div className="w-full border-b-2 pb-4 flex justify-between cursor-pointer" onClick={() => setActiveContracts(!activeContracts)}>
          <h4 className="text-sm font-semibold">Contratos</h4>
          <i className={`fa-solid fa-angle-down transition-all ${activeContracts && "rotate-180"}`}></i>
        </div>
        {
          activeContracts && <>
            {
              !client.hasContract && (
                <div className="text-md">
                  <b>Actual: </b> Sin contratos
                </div>
              )
            }
            {
              (client.hasContract) && (
                <div className="text-base">
                  <b>Actual: </b> Con contratos
                </div>
              )
            }
          </>
        }

        <div className="w-full border-b-2 pb-4 flex justify-between cursor-pointer" onClick={() => setActiveDevol(!activeDevol)}>
          <h4 className="text-sm font-semibold">Devoluciones</h4>
          <i className={`fa-solid fa-angle-down transition-all ${activeDevol && "rotate-180"}`}></i>
        </div>

        {
          activeDevol &&
          <>
            {city.devolu && city.devolu.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full pt-4 ">
                {city.devolu.map((devolution, index) => (
                  <div
                    key={devolution._id}
                    className="flex-shrink-0 rounded-[20px] border border-[#f0f4fd] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[15px] flex flex-col gap-2"
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
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-bold text-left sticky top-0 bg-white col-span-2">
                        <span>Productos</span>
                      </div>
                      <div className="font-bold sticky top-0 bg-white text-center">
                        <span>Cantidad</span>
                      </div>
                      {devolution.detail.map((detail: any, index: number) => {
                        let product = city.product?.find(
                          (product) => product._id === detail.item
                        );

                        return (
                          <React.Fragment key={index}>
                            <div className="flex items-center gap-2 col-span-2">
                              <img
                                src={
                                  product?.imageUrl ||
                                  "https://imgs.search.brave.com/cGS0E8gPAr04hSRQFlmImRAbRRWldP32Qfu_0atMNyQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudmV4ZWxzLmNv/bS9tZWRpYS91c2Vy/cy8zLzE1NjkyOC9p/c29sYXRlZC9wcmV2/aWV3LzZjNjVjMTc3/ZTk0ZTc1NTRlMWZk/YjBhZjMwMzhhY2I3/LWljb25vLWN1YWRy/YWRvLWRlLXNpZ25v/LWRlLWludGVycm9n/YWNpb24ucG5n"
                                }
                                alt=""
                                className="w-7 h-7 rounded-full"
                              />
                              <span className="CuadroVentaCliente-text">
                                {product ? product.name : "Producto no encontrado"}
                              </span>
                            </div>
                            <div className="CuadroVentaCliente-TextContainer font-semibold text-center">
                              <span className="CuadroVentaCliente-text">
                                {detail.quantity}
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay devoluciones registradas.</p>
            )}
          </>
        }
      </div>
    </div>
  );
};

export default InfoClient;
