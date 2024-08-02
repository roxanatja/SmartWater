import React, { useState } from "react";
import { Client } from "../../../../type/Cliente/Client";
import crearRegistroCaja from "../../../../services/CashRegisters";
import "./CashRegister.css";

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

  return (
    <div>
      {!showSecondModal ? (
        <div className="cobro-mini-modal">
          <div className="cobro-mini-modal-content">
            <button className="cobro-mini-modal-close" onClick={onClose}>
              X
            </button>

            <div className="modal-datos">
              <div className="modalInfoClients">
                {client.storeImage && client.storeImage.length > 1 ? (
                  <img
                    src={client.storeImage}
                    alt=""
                    className="modalInfoClients-imgStore"
                  />
                ) : (
                  <div className="cobro-mini-modal-image-placeholder"></div>
                )}
                <span className="modalInfoClients-name">{client.fullName}</span>
                <div className="saldo">
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
              <div className="input-container">
                <span>Pago a cuenta</span>
                <input
                  type="number"
                  value={amount}
                  onChange={handleChange}
                  placeholder="Monto a cobrar"
                  min="0"
                  step="0.01"
                />
                <span>Bs</span>
              </div>
              {error && <p className="error">{error}</p>}
            </div>
            <div className="cobro-mini-modal-actions">
              <button onClick={handleSubmit} className="btn-registrar-modal">
                Registrar Cobro
              </button>
            </div>
          </div>
        </div>
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
