import { Client } from "../../../Class/types.data";

const InfoClient = ({ client }: { client: Client }) => {
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

        <div className="w-full border-b-2 pb-4 flex justify-between">
          <h4 className="text-sm font-semibold">Informacion general</h4>
          <i className="fa-solid fa-angle-up"></i>
        </div>

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
              <p>{client.zone || "N/A"}</p>
            </li>
            <li className="flex gap-2 text-base">
              <p className="font-medium">Barrio:</p>
              <p>{client.district || "N/A"}</p>
            </li>
            <li className="flex gap-2 text-base">
              <p className="font-medium">Fecha de Registro:</p>
              <p>{new Date(client.created).toLocaleString() || "N/A"}</p>
            </li>
            <li className="flex gap-2 text-base">
              <p className="font-medium">Ultima venta:</p>
              <p>{new Date(client.lastSale).toLocaleString() || "N/A"}</p>
            </li>
            <li className="flex gap-2 text-base">
              <p className="font-medium">Renovacion Promedio:</p>
              <p>{client.renewInDays || "N/A"}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoClient;
