import React, { useState, useCallback, useEffect } from "react";
import { Client } from "../../../../type/Cliente/Client";
import "./CashRegister.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { Bills } from "../../../../type/Bills";
import Input from "../../EntryComponents/Inputs";
import { toast } from "react-hot-toast";
import { UserData } from "../../../../type/UserData";
import { Sale } from "../../../../type/Sale/Sale";
import { BillsApiConector, ProductsApiConector, SalesApiConector } from "../../../../api/classes";
import { IBillsBody } from "../../../../api/types/bills";
import { AuthService } from "../../../../api/services/AuthService";
import { formatDateTime } from "../../../../utils/helpers";

interface CobroMiniModalProps {
  client: Client;
  onClose: () => void;
}

const CobroMiniModal: React.FC<CobroMiniModalProps> = ({ client, onClose }) => {
  const [data, setData] = useState<{ bills: Bills[]; sales: Sale[] } | null>(null);
  const [credict, setCredict] = useState<number | null>(null);
  const [active, setActive] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<IBillsBody['data']>({
    defaultValues: {
      amount: 0,
      cashPayment: true,
      paymentMethodCurrentAccount: false,
    },
    mode: 'all'
  });

  const getBillsInformation = useCallback(async () => {
    const billsData = (await BillsApiConector.get({ filters: { client: client._id }, pagination: { page: 1, pageSize: 3000 } }))?.data || [];
    const salesData = (await SalesApiConector.get({ filters: { client: client._id }, pagination: { page: 1, pageSize: 3000 } }))?.data || [];
    const products = (await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];

    const loansWithProductNames = salesData.map((loan) => {
      return {
        ...loan,
        detail: loan.detail.map((detailItem) => {
          const product = products.find((x) => x._id === detailItem.product);
          return {
            ...detailItem,
            product: product ? product.name : "Unknown product",
          };
        }),
      };
    });
    setData({
      bills: billsData,
      sales: loansWithProductNames.filter(
        (x) => x.creditSale === true && x.total > 0
      ),
    });
  }, [client._id]);

  useEffect(() => {
    getBillsInformation();
  }, [getBillsInformation]);

  const onSubmit: SubmitHandler<IBillsBody['data']> = async (data) => {
    const userData: UserData | null = AuthService.getUser();

    const response = await BillsApiConector.create({
      data: {
        ...data,
        client: client._id,
        user: userData?._id || "",
        zone: client.zone,
      }
    });

    if (response) {
      toast.success("Cobro registrado");
      reset();
      onClose();
      window.location.reload();
      getBillsInformation();
    } else {
      toast.error("Uppss error al registrar el Cobro");
    }
  };

  const validateAmount = (value: number) => {
    const credit = credict ? credict : client.credit
    if (!watch("sale")) {
      return "Tiene que selecionar una venta";
    }

    if (value <= 0) {
      return "El monto no puede ser menor que 0";
    }
    if (value > credit) {
      return `El monto no puede exceder el saldo de ${credit} Bs.`;
    }

    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-datos">
        <div className="flex justify-between gap-4 w-full">
          <div className="flex justify gap-2 items-center">
            {
              client.storeImage ?
                <img
                  src={client?.storeImage || ""}
                  className="w-8 h-8 rounded-full"
                  alt="storeImage"
                /> :
                <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center">
                  <div className="opacity-0">.</div>
                  <p className="absolute font-extrabold whitespace-nowrap">
                    {client.fullName?.[0] || "S"}
                  </p>
                </div>
            }
            <span className="text-sm">{client.fullName}</span>
          </div>
          <div className="flex justify-start items-center gap-2">
            <div className="infoClientes-saldo">
              <span style={{ color: "#1A3D7D" }}>Saldo a cobrar:</span>
            </div>
            <div className="infoClientes-moneda">
              <img src="./Moneda-icon.svg" alt="" />
              <div>{client.credit} Bs.</div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-between items-center pb-2 border-b-2 mb-2 cursor-pointer"
        onClick={() => setActive(!active)}
      >
        <p className="font-semibold text-sm">Ventas</p>
        <i className={`fa-solid fa-angle-up ${!active && "rotate-180"}`}></i>
      </div>

      {active && (
        <>
          <div className="infoClientes-ventas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
              {data?.sales.map((bill) => (
                <div
                  key={bill._id}
                  className={`p-4 border rounded shadow hover:shadow-lg transition cursor-pointer ${watch("sale") === bill._id && "border-2 border-blue_custom"
                    } ${errors.amount && !watch("sale") && "border-2 border-red-500"
                    }`}
                  onClick={() => {
                    setValue("sale", bill._id, { shouldValidate: true });
                    setValue("amount", bill.total, { shouldValidate: true });
                    setCredict(bill.total);
                  }}
                >
                  <h3 className="font-bold truncate">Venta ID: {bill._id}</h3>
                  <p>
                    <strong>Monto:</strong>{" "}
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(bill.total)}{" "}
                    Bs.
                  </p>
                  <p>
                    <strong>Credito:</strong> {bill.creditSale ? "Sí" : "No"}
                  </p>
                  <p>
                    <strong>Registrada:</strong>{" "}
                    {formatDateTime(bill.created, "numeric", "2-digit", "2-digit")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="infoClientes-ventas">
        <div className="input-container flex flex-col w-full">
          <div className="RegistrarVenta-opciones flex justify-center items-start w-full flex-col">
            <p className="text-md">Seleccione una opción</p>
            <div className="RegistrarVenta-grupo-checbox">
              <div className="RegistrarVenta-grupo-check">
                <input
                  className="input-check cursor-pointer accent-blue-600"
                  type="checkbox"
                  id="checkbox1"
                  checked={watch("cashPayment")}
                  onChange={() => {
                    const val = watch("cashPayment")
                    setValue("cashPayment", !val);
                    setValue("paymentMethodCurrentAccount", false);
                  }}
                />
                <label
                  htmlFor="checkbox1"
                  className="text-check cursor-pointer text-md"
                >
                  Efectivo
                </label>
              </div>
              <div className="RegistrarVenta-grupo-check">
                <input
                  className="input-check cursor-pointer accent-blue-600"
                  type="checkbox"
                  id="checkbox2"
                  checked={watch("paymentMethodCurrentAccount")}
                  onChange={() => {
                    const val = watch("paymentMethodCurrentAccount")
                    setValue("cashPayment", false);
                    setValue("paymentMethodCurrentAccount", !val);
                  }}
                />
                <label
                  htmlFor="checkbox2"
                  className="text-check cursor-pointer text-md"
                >
                  Cta. Cte
                </label>
              </div>
            </div>
          </div>
          <Input
            label="Pago a cuenta"
            register={register}
            validateAmount={validateAmount}
            name="amount"
            type="number"
            placeholder="Monto a cobrar"
            min="0"
            step="0.01"
            errors={errors.amount}
            button={<span className="text-lg">Bs</span>}
          />
        </div>
      </div>

      <div
        className="flex justify-between items-center pb-2 border-b-2 my-4 cursor-pointer"
        onClick={() => setActive(!active)}
      >
        <p className="font-semibold text-sm">Cobros</p>
        <i className={`fa-solid fa-angle-up ${active && "rotate-180"}`}></i>
      </div>

      {!active && (
        <div className="infoClientes-ventas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
            {data?.bills.map((bill) => (
              <div
                key={bill._id}
                className="p-4 border rounded shadow hover:shadow-lg transition"
              >
                <h3 className="font-bold truncate">Bill ID: {bill._id}</h3>
                <p>
                  <strong>Monto: </strong>
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(bill.amount)}{" "}
                  Bs.
                </p>
                <p>
                  <strong>Efectivo:</strong> {bill.cashPayment ? "Sí" : "No"}
                </p>
                <p>
                  <strong>Registrada:</strong>{" "}
                  {formatDateTime(bill.created, "numeric", "2-digit", "2-digit", true)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full flex justify-center items-center sticky bottom-0 py-2 bg-white">
        <button
          type="submit"
          disabled={client.credit <= 0 || !isValid}
          className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded-full text-base disabled:bg-gray-400"
        >
          Registrar cobro
        </button>
      </div>
    </form>
  );
};

export default CobroMiniModal;
