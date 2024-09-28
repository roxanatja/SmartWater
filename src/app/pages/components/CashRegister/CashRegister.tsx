import React, { useState } from "react";
import { Client } from "../../../../type/Cliente/Client";
import crearRegistroCaja from "../../../../services/CashRegisters";
import "./CashRegister.css";
import Modal from "../../EntryComponents/Modal";
import { useForm } from "react-hook-form";
import Input from "../../EntryComponents/Inputs";

interface CobroMiniModalProps {
  client: Client;
  onClose: () => void;
}

const CobroMiniModal: React.FC<CobroMiniModalProps> = ({ client, onClose }) => {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setError("El monto no puede ser negativo");
    } else if (value === 0) {
      setError("El monto debe ser mayor a 0");
    } else if (value > client.credit) {
      setError("El monto a cobrar no puede ser mayor al saldo");
    } else {
      setError(null);
      setAmount(value);
    }
  };

  const handleSubmit = () => {
    if (amount <= 0 || amount > client.credit) {
      setError("El monto a cobrar no es válido");
      return;
    }
    setShowSecondModal(true);
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(e.target.value);
  };

  const handleAcceptPaymentMethod = () => {
    // Lógica para aceptar el método de pago
    console.log("Método de pago aceptado:", paymentMethod);
    onClose();
  };

  const { register } = useForm();

  return (
    <div>
      {!showSecondModal ? (
        <Modal
          isOpen={!showSecondModal}
          onClose={onClose}
          className="p-6 w-2/12"
        >
          <div className="modal-datos">
            <div className="flex justify-between gap-4 w-full">
              <div className="flex justify gap-2 items-center">
                {client.storeImage && client.storeImage.length > 1 ? (
                  <img
                    src={client.storeImage}
                    alt=""
                    className="modalInfoClients-imgStore"
                  />
                ) : (
                  <div className="cobro-mini-modal-image-placeholder"></div>
                )}
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

          <div className="infoClientes-ventas">
            <div className="input-container flex flex-col w-full">
              <Input
                label="Pago a cuenta"
                register={register}
                name="saldo"
                type="number"
                value={amount}
                // className="text-center"
                onChange={handleChange}
                placeholder="Monto a cobrar"
                min="0"
                step="0.01"
                icon={<span>Bs</span>}
                onClick={handleSubmit}
                button={"Registrar Cobro"}
              />
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </Modal>
      ) : (
        <div className="cobro-mini-modal">
          <div className="cobro-mini-modal-content">
            <div className="cobro-mini-modal-content">
              <button className="cobro-mini-modal-close" onClick={onClose}>
                X
              </button>
              <div className="payment-method-modal-options">
                <label>
                  <input
                    type="radio"
                    name="payment-method"
                    value="cash"
                    onChange={handlePaymentMethodChange}
                  />
                  Efectivo
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment-method"
                    value="credit"
                    onChange={handlePaymentMethodChange}
                  />
                  Cuenta Corriente
                </label>
              </div>
              <div className="payment-method-modal-actions1">
                <button
                  onClick={handleAcceptPaymentMethod}
                  className="btn-registrar-modal"
                >
                  Aceptar
                </button>
                <button onClick={onClose} className="btn-cancel-modal">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CobroMiniModal;
