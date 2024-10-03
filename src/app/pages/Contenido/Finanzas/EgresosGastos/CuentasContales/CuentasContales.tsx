import { useContext } from "react";
import { Account } from "../../../../../../type/AccountEntry";
import { EgresosGastosContext } from "../EgresosGastosContext";
import "./CuentasContales.css";

const CuentasContales = ({ accounts }: { accounts?: Account[] }) => {
  const { setShowModal } = useContext(EgresosGastosContext);
  return (
    <>
      <div className="CuentasContales-container">
        <div className="CuentasContables-titulo">
          <span>Cuentas contables</span>
        </div>
        <div style={{ width: "324px" }}>
          <form
            className="search__container"
            style={{ marginBottom: "0px" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="search__input"
              type="text"
              placeholder="Buscar"
              required
            />
            <button type="submit" className="boton-buscar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19.5 9.75C19.5 11.9016 18.8016 13.8891 17.625 15.5016L23.5594 21.4406C24.1453 22.0266 24.1453 22.9781 23.5594 23.5641C22.9734 24.15 22.0219 24.15 21.4359 23.5641L15.5016 17.625C13.8891 18.8062 11.9016 19.5 9.75 19.5C4.36406 19.5 0 15.1359 0 9.75C0 4.36406 4.36406 0 9.75 0C15.1359 0 19.5 4.36406 19.5 9.75ZM9.75 16.5C10.6364 16.5 11.5142 16.3254 12.3331 15.9862C13.1521 15.647 13.8962 15.1498 14.523 14.523C15.1498 13.8962 15.647 13.1521 15.9862 12.3331C16.3254 11.5142 16.5 10.6364 16.5 9.75C16.5 8.86358 16.3254 7.98583 15.9862 7.16689C15.647 6.34794 15.1498 5.60382 14.523 4.97703C13.8962 4.35023 13.1521 3.85303 12.3331 3.51381C11.5142 3.17459 10.6364 3 9.75 3C8.86358 3 7.98583 3.17459 7.16689 3.51381C6.34794 3.85303 5.60382 4.35023 4.97703 4.97703C4.35023 5.60382 3.85303 6.34794 3.51381 7.16689C3.17459 7.98583 3 8.86358 3 9.75C3 10.6364 3.17459 11.5142 3.51381 12.3331C3.85303 13.1521 4.35023 13.8962 4.97703 14.523C5.60382 15.1498 6.34794 15.647 7.16689 15.9862C7.98583 16.3254 8.86358 16.5 9.75 16.5Z"
                  fill="black"
                />
              </svg>
            </button>
          </form>
        </div>
        <div className="flex flex-col w-full gap-4">
          {accounts &&
            accounts?.map((row, index) => (
              <div className="flex gap-4 w-full" key={index}>
                <div className="CuentasContales-input">
                  <span>{row.name}</span>
                </div>
                <button className="btn">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            ))}
        </div>
        <div className="w-full flex justify-end gap-2 items-center py-6 pr-6">
          <button
            onClick={() => setShowModal(true)}
            className="CuentasContables-btn-crear"
          >
            <span>Crear cuenta</span>
          </button>
        </div>
      </div>
    </>
  );
};

export { CuentasContales };
