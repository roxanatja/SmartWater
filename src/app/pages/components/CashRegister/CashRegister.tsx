import React, { useState, useCallback, useEffect } from "react";
import { Client } from "../../../../type/Cliente/Client";
import "./CashRegister.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { Bills } from "../../../../type/Bills";
import Input from "../../EntryComponents/Inputs";
import { toast } from "react-hot-toast";
import { UserData } from "../../../../type/UserData";
import { BillsApiConector } from "../../../../api/classes";
import { IBillByClientBody } from "../../../../api/types/bills";
import { AuthService } from "../../../../api/services/AuthService";
import { formatDateTime } from "../../../../utils/helpers";

interface CobroMiniModalProps {
  client: Client;
  onClose: () => void;
}

const CobroMiniModal: React.FC<CobroMiniModalProps> = ({ client, onClose }) => {
  const [data, setData] = useState<Bills[]>([]);
  const [active, setActive] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<IBillByClientBody['data']>({
    defaultValues: {
      amount: 0,
      cashPayment: false,
      paymentMethodCurrentAccount: false,
    },
    mode: 'all'
  });

  const getBillsInformation = useCallback(async () => {
    const billsData = (await BillsApiConector.get({ filters: { client: client._id }, pagination: { page: 1, pageSize: 3000 } }))?.data || [];
    setData(billsData);
  }, [client._id]);

  useEffect(() => {
    getBillsInformation();
  }, [getBillsInformation]);

  const onSubmit: SubmitHandler<IBillByClientBody['data']> = async (data) => {
    const userData: UserData | null = AuthService.getUser();

    const response = await BillsApiConector.createByClient({
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
    if (value <= 0) {
      return "El monto no puede ser menor que 0";
    }
    if (value > client.credit) {
      return `El monto no puede exceder el saldo de ${client.credit} Bs.`;
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
              <span className="text-blue_custom">Saldo a cobrar:</span>
            </div>
            <div className="infoClientes-moneda bg-blue_custom">
              <img src="./Moneda-icon.svg" alt="" />
              <div>{client.credit} Bs.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="infoClientes-ventas pb-4">
        <div className="input-container flex flex-col w-full">
          <div className="RegistrarVenta-opciones flex justify-center items-start w-full flex-col">
            <p className="text-md text-font-color">Seleccione una opción</p>
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
                  className="text-check cursor-pointer text-md text-font-color"
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
                  className="text-check cursor-pointer text-md text-font-color"
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
            max={client.credit}
            step="0.01"
            errors={errors.amount}
            button={<span className="text-lg">Bs</span>}
          />
        </div>
      </div>

      <div className="w-full flex justify-center items-center sticky bottom-0 py-2 bg-main-background">
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
