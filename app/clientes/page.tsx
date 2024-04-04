import { PageTitle } from "@/components/ui/PageTitle";
import { ClientesIcon } from "@/components/icons/Icons";
import { FiltroPaginado } from "@/components/Clientes/FIltroPaginado";

const Clientes = () => {
  return (
    <div>
      <PageTitle
        titulo="Clientes"
        icon={<ClientesIcon className="w-12 h-12" />}
      />
      <FiltroPaginado />
    </div>
  );
};

export default Clientes;
