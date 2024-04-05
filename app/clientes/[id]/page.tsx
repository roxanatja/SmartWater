import React from "react";

interface ClientProps {
  params: {
    id: string;
  };
}

const ClientDetailPage = async ({ params }: ClientProps) => {
  const { id } = params;

  try {
    const response = await fetch(`/api/clients?id=${id}`);
    const client = await response.json();

    if (!client) {
      return <div>Cliente no encontrado</div>;
    }

    return (
      <div>
        <h2>{client.nombre}</h2>
        <p>{client.email}</p>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Error al obtener los detalles del cliente</div>;
  }
};

export default ClientDetailPage;