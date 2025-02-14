import { useContext, useEffect, useRef, useState } from "react";
import "./CuadroProveedor.css";
import { Option } from "../../../../components/Option/Option";
import { Providers } from "../../../../../../type/providers";
import { ProveedoresContext } from "../ProveedoresContext";
import toast from "react-hot-toast";
import { ProvidersApiConector } from "../../../../../../api/classes";
import { formatIncompletePhoneNumber } from "libphonenumber-js";

const CuadroProveedor = ({ provider }: { provider: Providers }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { setProvider } = useContext(ProveedoresContext);

  const optionsRef = useRef<HTMLDivElement>(null);

  const Opciones = () => {
    setShowOptions(!showOptions);
  };

  const Edit = () => {
    setProvider(provider);
    setShowOptions(false);
  };

  const Delete = async () => {
    toast.error(
      (t) => (
        <div>
          <p className="mb-4 text-center text-[#888]">
            Se <b>eliminará</b> este proveedor <br /> pulsa <b>Proceder</b> para continuar
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
                const response = await ProvidersApiConector.delete({ providerId: provider?._id || '' });
                if (!!response) {
                  if (response.mensaje.includes("No")) {
                    toast.error(response.mensaje, {
                      position: "top-center",
                      duration: 2000
                    });
                  } else if (response.mensaje) {
                    toast.success(response.mensaje, {
                      position: "top-center",
                      duration: 2000
                    });
                    window.location.reload();
                  }
                } else {
                  toast.error("Error al eliminar el proveedor", {
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
    setShowOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="CuadroUsuarios-container relative bg-blocks dark:border-blocks">
        <div className="CuadroUsuarios-header">
          <div className="flex justify-start gap-4 w-[calc(100%_-_30px)] flex-wrap">
            <div className="CuadroUsuarios-header1 items-start justify-between w-full pr-4">
              <span className="font-semibold text-base">
                {provider.fullName}
              </span>
              <a
                href={`https://wa.me/${provider.phoneNumber || ""}`}
                className="btn-whatsapp flex items-center gap-2"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/whap-icon.svg" alt="Icono de WhatsApp" className="w-[20px] h-[20px]" />
                <span className="whitespace-nowrap">{provider.phoneNumber ? formatIncompletePhoneNumber(provider.phoneNumber, "BO",) : "N/A"}</span>
              </a>
            </div>

            <div className="absolute right-0 p-4 rounded-full z-[35] top-0 flex flex-col gap-4">
              <div className="relative" ref={optionsRef}>
                <button type="button" className="invert-0 dark:invert" onClick={() => Opciones()}>
                  <img src="/opcion-icon.svg" alt="" />
                </button>
                <Option
                  editAction={Edit}
                  visible={showOptions}
                  editar={true}
                  eliminar={true}
                  deleteAction={Delete}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[calc(100%_-_30px)] flex flex-col gap-2 text-sm">
          <div className="flex gap-2">
            <span className="">Correo:</span>
            <span className="text-blue_custom"><a href={`mailto:${provider.email}`}>{provider.email}</a></span>
          </div>
          <div className="flex gap-2">
            <span className="">Dirección:</span>
            <span className="text-blue_custom">{provider.address}</span>
          </div>
          <div className="flex gap-2">
            <span className="">NIT:</span>
            <span className="text-blue_custom">{provider.NIT}</span>
          </div>

          <div className="flex items-center justify-end w-full">
            <div className="infoClientes-ventas relative z-10">
              <span className="text-blue_custom">
                Saldo por pagar Bs.
              </span>
              <div className="infoClientes-moneda bg-blue_custom"              >
                <img src="/Moneda-icon.svg" alt="" />
                <div>
                  <span>{0} Bs.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export { CuadroProveedor };
