import { useContext, useState } from "react";
import "./CuadroProveedor.css";
import { Option } from "../../../../components/Option/Option";
import { Providers } from "../../../../../../type/providers";
import { ProveedoresContext } from "../ProveedoresContext";

const CuadroProveedor = ({ provider }: { provider: Providers }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { setProvider, setShowModal } = useContext(ProveedoresContext);

  const Opciones = () => {
    setShowOptions(!showOptions);
  };

  const Edit = () => {
    setProvider(provider);
    setShowOptions(false);
    setShowModal(true);
  };

  const Delete = () => {
    setShowOptions(false);
  };
  return (
    <>
      <div className="w-full bg-white shadow-lg rounded-2xl p-4 border flex flex-row-reverse relative justify-between">
        <button className="btn" onClick={Opciones}>
          <span className="material-symbols-outlined">more_vert</span>
          <Option
            visible={showOptions}
            editar
            eliminar
            editAction={Edit}
            deleteAction={Delete}
          />
        </button>
        <div className="flex flex-col gap-2">
          <div className="CuadroVentaCliente-body">
            <span>Correo: </span>
            <span className="text-blue_custom">{provider.fullName}</span>
          </div>
          <div className="CuadroVentaCliente-body">
            <span>Dirección: </span>
            <span className="text-blue_custom">{provider.address}</span>
          </div>
          <div className="CuadroVentaCliente-body">
            <span>Nit: </span>
            <span className="text-blue_custom">{provider.NIT}</span>
          </div>
          <div className="CuadroVentaCliente-body">
            <span>Telefono: </span>
            <span className="text-blue_custom">
              {provider.phoneNumber || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export { CuadroProveedor };
