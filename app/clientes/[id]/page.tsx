import React from "react";

interface ClientProps {
  params: {
    id: string;
  };
}

const ClientDetailPage = async ({ params }: ClientProps) => {
  const { id } = params;
  const client = await GetClientById(id);

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <div>
      <h2>{client.nombre}</h2>
      <p>{client.email}</p>
      {/* Renderizar otros detalles del cliente */}
    </div>
  );
};

export default ClientDetailPage;
